import { useMemo } from 'react';

import { useSettings } from '@context/SettingsProvider';
import type { ChatUserContext } from '@helpers/llmClient';

import type { PerformanceFormData, PerformanceTipsData } from '../types';

interface UseChatUserContextOptions {
  formData: PerformanceFormData;
  tipsData: PerformanceTipsData | null;
  selectedTipIds: Set<string>;
}

export function useChatUserContext({
  formData,
  tipsData,
  selectedTipIds,
}: UseChatUserContextOptions): ChatUserContext {
  const { settings } = useSettings();

  return useMemo<ChatUserContext>(() => {
    const ctx: ChatUserContext = {};

    if (settings.ai_context_profile) {
      ctx.profile = {
        age: formData.age,
        gender: formData.gender,
        heightCm: formData.heightCm,
        weightKg: formData.weightKg,
        primarySportType: formData.primarySportType,
        primaryGoal: formData.primaryGoal,
        primaryGoalTimelineMonths: formData.primaryGoalTimelineMonths,
        secondaryGoals: formData.secondaryGoals,
        currentLimitations: formData.currentLimitations as unknown as Record<string, string[]>,
        sleepHoursPerNight: formData.sleepHoursPerNight,
        stressLevel: formData.stressLevel,
        dailyCalorieIntake: formData.dailyCalorieIntake,
        nutritionPatterns: formData.nutritionPatterns,
        recoveryMethods: formData.recoveryMethods as unknown as Record<string, unknown>,
        trainingHoursPerWeek: formData.trainingHoursPerWeek,
        highIntensitySessionsPerWeek: formData.highIntensitySessionsPerWeek,
        currentLevelDescription: formData.currentLevelDescription,
        secondaryGoalCurrentLevels: formData.secondaryGoalCurrentLevels,
      };
    }

    // Biomarkers are intentionally NOT sent from the client. The backend
    // recomputes them server-side from the same pipeline as the overview /
    // deep research (honoring the ai_context_biomarkers preference itself),
    // so the chat can never see a different set than the rest of the app.

    if (settings.ai_context_performance_plan && tipsData) {
      ctx.performancePlan = Object.entries(tipsData.tips_by_goal)
        .filter(([key]) => key !== 'biomarkers')
        .map(([, goalData]) => ({
          goal: goalData.goal,
          tips: goalData.tips
            .filter((tip) => selectedTipIds.has(tip.id))
            .map((tip) => ({
              category: tip.category,
              title: tip.title,
              description: tip.description,
            })),
        }))
        .filter((g) => g.tips.length > 0);
    }

    return ctx;
  }, [
    settings.ai_context_profile,
    settings.ai_context_performance_plan,
    formData,
    tipsData,
    selectedTipIds,
  ]);
}
