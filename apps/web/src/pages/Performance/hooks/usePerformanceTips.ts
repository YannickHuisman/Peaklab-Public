import { useCallback, useState } from 'react';

import { useAI, useData } from '@package/api';

import type { PerformanceFormData, PerformanceTipsData } from '../types';

interface UsePerformanceTipsOptions {
  formData: PerformanceFormData;
}

export function usePerformanceTips({ formData }: UsePerformanceTipsOptions) {
  const { generateTrainingSchema, loading } = useAI();
  const { savePerformanceProfile } = useData();

  const [tipsData, setTipsData] = useState<PerformanceTipsData | null>(null);
  const [planFormData, setPlanFormData] = useState<PerformanceFormData | null>(null);
  const [selectedTipIds, setSelectedTipIds] = useState<Set<string>>(new Set());
  const [showTipSelection, setShowTipSelection] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isSavingTips, setIsSavingTips] = useState(false);

  const generate = useCallback(async (): Promise<PerformanceTipsData | null> => {
    try {
      const response = await generateTrainingSchema({
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
      });

      const typed = response as { performanceTips?: PerformanceTipsData };

      return typed.performanceTips ?? null;
    } catch {
      return null;
    }
  }, [formData, generateTrainingSchema]);

  const submit = useCallback(async () => {
    const tips = await generate();

    if (!tips) return;

    await savePerformanceProfile({ form_data: formData, ai_plan: tips });

    setTipsData(tips);
    setPlanFormData(formData);
    setSelectedTipIds(new Set());
    setShowTipSelection(true);
    window.scrollTo(0, 0);
  }, [generate, formData, savePerformanceProfile]);

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

      await savePerformanceProfile({ form_data: formData, ai_plan: updatedPlan });

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

  const regenerate = useCallback(async () => {
    const tips = await generate();

    if (!tips) return;

    await savePerformanceProfile({ form_data: formData, ai_plan: tips });
    setTipsData(tips);
    setPlanFormData(formData);
    setSelectedTipIds(new Set());
    setShowTipSelection(true);
    setShowResults(false);
    window.scrollTo(0, 0);
  }, [generate, formData, savePerformanceProfile]);

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
    isGenerating: loading,
    submit,
    toggleTip,
    saveTips,
    editTips,
    regenerate,
  };
}
