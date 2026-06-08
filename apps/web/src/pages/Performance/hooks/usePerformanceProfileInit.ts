import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';

import { useData } from '@package/api';

import type { PerformanceFormData, PerformanceTipsData } from '../types';

interface UsePerformanceProfileInitOptions {
  setValues: (values: PerformanceFormData) => void;
  setTipsData: Dispatch<SetStateAction<PerformanceTipsData | null>>;
  setPlanFormData: Dispatch<SetStateAction<PerformanceFormData | null>>;
  setSelectedTipIds: Dispatch<SetStateAction<Set<string>>>;
  setShowResults: Dispatch<SetStateAction<boolean>>;
}

export function usePerformanceProfileInit({
  setValues,
  setTipsData,
  setPlanFormData,
  setSelectedTipIds,
  setShowResults,
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
      if (profileData) {
        setValues(profileData.form_data as PerformanceFormData);

        const aiPlan = profileData.ai_plan as PerformanceTipsData | null;

        if (aiPlan?.tips_by_goal) {
          setTipsData(aiPlan);
          setSelectedTipIds(new Set(aiPlan.selected_tip_ids ?? []));
          setPlanFormData(
            ((profileData as { plan_form_data?: unknown }).plan_form_data ||
              profileData.form_data) as PerformanceFormData
          );
          setShowResults(true);
        }
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
  ]);

  return { hasInitialized, profileLoading: performanceProfile.loading };
}
