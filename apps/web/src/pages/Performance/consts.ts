import type { PerformanceFormData } from './types';

export const TOTAL_STEPS = 7;

export const STEP_VALIDATION: Record<number, (values: PerformanceFormData) => boolean> = {
  1: (values) =>
    !!(
      values.age &&
      values.gender &&
      values.heightCm &&
      values.weightKg &&
      values.primarySportType
    ),
  2: (values) => !!(values.primaryGoal && values.primaryGoalTimelineMonths),
  5: (values) => values.nutritionPatterns.length > 0,
};
