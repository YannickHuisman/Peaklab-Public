import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';

import { useData } from '@package/api';

import type { PerformanceFormData, PerformanceTipsData } from '../types';

interface UsePerformanceProfileInitOptions {
  setValues: (values: PerformanceFormData) => void;
  setTipsData: Dispatch<SetStateAction<PerformanceTipsData | null>>;
  setPlanFormData: Dispatch<SetStateAction<PerformanceFormData | null>>;
  setSelectedTipIds: Dispatch<SetStateAction<Set<string>>>;
  setShowResults: Dispatch<SetStateAction<boolean>>;
  loadDraft: () => PerformanceFormData | null;
}

export function usePerformanceProfileInit({
  setValues,
  setTipsData,
  setPlanFormData,
  setSelectedTipIds,
  setShowResults,
  loadDraft,
}: UsePerformanceProfileInitOptions) {
  const { performanceProfile, fetchPerformanceProfile } = useData();
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    fetchPerformanceProfile();
  }, [fetchPerformanceProfile]);

  useEffect(() => {
    if (!performanceProfile.fetched || hasInitialized) return;

    const profileData = performanceProfile.data;

    queueMicrotask(() => {
      const draft = loadDraft();
      const aiPlan = (profileData?.ai_plan as PerformanceTipsData | null) ?? null;
      const hasPlan = Boolean(aiPlan?.tips_by_goal);

      if (profileData) {
        // With a plan the user lands in the results view, so the saved
        // form_data is authoritative. Without a plan, prefer an unsaved
        // stepper draft over the saved form_data so progress isn't lost.
        setValues(!hasPlan && draft ? draft : (profileData.form_data as PerformanceFormData));

        if (aiPlan?.tips_by_goal) {
          setTipsData(aiPlan);
          setSelectedTipIds(new Set(aiPlan.selected_tip_ids ?? []));
          setPlanFormData(
            ((profileData as { plan_form_data?: unknown }).plan_form_data ||
              profileData.form_data) as PerformanceFormData
          );
          setShowResults(true);
        }
      } else if (draft) {
        // No saved profile yet, but the user had unsaved stepper progress.
        setValues(draft);
      }

      setHasInitialized(true);
    });
  }, [
    performanceProfile.fetched,
    performanceProfile.data,
    hasInitialized,
    setValues,
    setTipsData,
    setPlanFormData,
    setSelectedTipIds,
    setShowResults,
    loadDraft,
  ]);

  return { hasInitialized, profileLoading: performanceProfile.loading };
}
