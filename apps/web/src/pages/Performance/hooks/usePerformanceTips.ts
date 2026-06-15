import { useCallback, useEffect, useRef, useState } from 'react';

import { useAI, useData } from '@package/api';

import type { PerformanceFormData, PerformanceTipsData } from '../types';
import { usePerformanceGenerationJob } from './usePerformanceGenerationJob';

interface UsePerformanceTipsOptions {
  formData: PerformanceFormData;
}

// Ignore persisted jobs older than this; the server evicts them after ~15 min,
// so resuming one would only flash the generating screen before a 404.
const MAX_JOB_AGE_MS = 15 * 60 * 1000;

function buildTrainingSchemaInput(formData: PerformanceFormData) {
  return {
    age: formData.age ?? 0,
    gender: formData.gender ?? undefined,
    heightCm: formData.heightCm ?? undefined,
    weightKg: formData.weightKg ?? undefined,
    primarySportType: formData.primarySportType ?? undefined,
    primaryGoal: formData.primaryGoal,
    primaryGoalTimelineMonths: formData.primaryGoalTimelineMonths ?? undefined,
    secondaryGoals: formData.secondaryGoals.filter((g) => g.trim().length > 0),
    currentLimitations: formData.currentLimitations,
    sleepHoursPerNight: formData.sleepHoursPerNight,
    stressLevel: formData.stressLevel,
    dailyCalorieIntake: formData.dailyCalorieIntake,
    nutritionPatterns: formData.nutritionPatterns,
    recoveryMethods: formData.recoveryMethods as unknown as Record<
      string,
      { active: boolean; frequency?: 'rarely' | 'sometimes' | 'regular' }
    >,
    trainingHoursPerWeek: formData.trainingHoursPerWeek,
    highIntensitySessionsPerWeek: formData.highIntensitySessionsPerWeek,
    currentLevelDescription: formData.currentLevelDescription ?? undefined,
    secondaryGoalCurrentLevels: formData.secondaryGoalCurrentLevels,
  };
}

export function usePerformanceTips({ formData }: UsePerformanceTipsOptions) {
  const { generateTrainingSchema, resumeTrainingSchema, loading } = useAI();
  const { savePerformanceProfile } = useData();
  const { loadJob, saveJob, clearJob } = usePerformanceGenerationJob();

  const [tipsData, setTipsData] = useState<PerformanceTipsData | null>(null);
  const [planFormData, setPlanFormData] = useState<PerformanceFormData | null>(null);
  const [selectedTipIds, setSelectedTipIds] = useState<Set<string>>(new Set());
  const [showTipSelection, setShowTipSelection] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isSavingTips, setIsSavingTips] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Start in the "generating" state when a recent in-flight job is persisted, so
  // a reload resumes it instead of flashing the stepper.
  const [resuming, setResuming] = useState(() => {
    const job = loadJob();

    return Boolean(job && Date.now() - job.startedAt < MAX_JOB_AGE_MS);
  });

  // Persist the generated plan and move to tip selection. Shared by fresh
  // generation and reload-resume.
  const applyResult = useCallback(
    async (
      tips: PerformanceTipsData,
      provider: string | undefined,
      generatedWith: PerformanceFormData
    ): Promise<boolean> => {
      const saved = await savePerformanceProfile({
        form_data: generatedWith,
        ai_plan: tips,
        ai_plan_provider: provider,
      });

      if (!saved) {
        setError('Opslaan van je plan is mislukt. Probeer het opnieuw.');

        return false;
      }

      setTipsData(tips);
      setPlanFormData(generatedWith);
      setSelectedTipIds(new Set());
      setShowTipSelection(true);
      setShowResults(false);
      window.scrollTo(0, 0);

      return true;
    },
    [savePerformanceProfile]
  );

  const runGeneration = useCallback(async () => {
    const generatedWith = formData;

    setError(null);

    let response;

    try {
      // Persist the job id the moment it's created so a reload can resume it.
      response = await generateTrainingSchema(buildTrainingSchemaInput(generatedWith), (jobId) =>
        saveJob({ jobId, formData: generatedWith, startedAt: Date.now() })
      );
    } catch (err) {
      clearJob();
      setError(err instanceof Error ? err.message : 'Onbekende fout');

      return;
    }

    clearJob();

    if (!response.performanceTips) return;

    await applyResult(
      response.performanceTips as PerformanceTipsData,
      response.aiProvider,
      generatedWith
    );
  }, [formData, generateTrainingSchema, saveJob, clearJob, applyResult]);

  // On mount, resume an in-flight generation started before a reload.
  const resumedRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (resumedRef.current) return;
    resumedRef.current = true;

    const job = loadJob();

    if (!job || Date.now() - job.startedAt >= MAX_JOB_AGE_MS) {
      if (job) clearJob(); // expired — don't bother polling a job the server has dropped
      setResuming(false);

      return;
    }

    void (async () => {
      try {
        const response = await resumeTrainingSchema(job.jobId);

        if (!mountedRef.current) return;
        clearJob();

        if (response.performanceTips) {
          await applyResult(
            response.performanceTips as PerformanceTipsData,
            response.aiProvider,
            job.formData
          );
        }
      } catch (err) {
        if (!mountedRef.current) return;
        clearJob();
        setError(err instanceof Error ? err.message : 'Onbekende fout');
      } finally {
        if (mountedRef.current) setResuming(false);
      }
    })();
  }, [loadJob, resumeTrainingSchema, clearJob, applyResult]);

  const toggleTip = useCallback((id: string) => {
    setSelectedTipIds((prev) => {
      const next = new Set(prev);

      if (next.has(id)) next.delete(id);
      else next.add(id);

      return next;
    });
  }, []);

  const saveTips = useCallback(async () => {
    if (!tipsData) return;

    setIsSavingTips(true);
    try {
      const updatedPlan: PerformanceTipsData = {
        ...tipsData,
        selected_tip_ids: [...selectedTipIds],
      };

      const saved = await savePerformanceProfile({ form_data: formData, ai_plan: updatedPlan });

      if (!saved) {
        setError('Opslaan van je selectie is mislukt. Probeer het opnieuw.');

        return;
      }

      setError(null);
      setTipsData(updatedPlan);
      setShowTipSelection(false);
      setShowResults(true);
      window.scrollTo(0, 0);
    } finally {
      setIsSavingTips(false);
    }
  }, [tipsData, selectedTipIds, formData, savePerformanceProfile]);

  const editTips = useCallback(() => {
    setShowTipSelection(true);
    setShowResults(false);
    window.scrollTo(0, 0);
  }, []);

  return {
    tipsData,
    setTipsData,
    planFormData,
    setPlanFormData,
    selectedTipIds,
    setSelectedTipIds,
    showTipSelection,
    setShowTipSelection,
    showResults,
    setShowResults,
    isSavingTips,
    isGenerating: loading || resuming,
    error,
    submit: runGeneration,
    toggleTip,
    saveTips,
    editTips,
    regenerate: runGeneration,
  };
}
