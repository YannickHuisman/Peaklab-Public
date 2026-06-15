import type { SnapshotCardType } from './components/PerformanceSnapshot/PerformanceSnapshot';
import type { PerformanceFormData } from './types';

export const CARD_LABELS: Record<SnapshotCardType, string> = {
  profile: 'Basis Profiel',
  goals: 'Performance Doelen',
  training: 'Trainingsbelasting',
  recovery: 'Herstel & Welzijn',
  limitations: 'Beperkingen & Klachten',
  nutrition: 'Voeding',
};

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
