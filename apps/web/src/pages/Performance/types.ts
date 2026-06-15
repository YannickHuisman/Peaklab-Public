export type SportType = 'strength' | 'endurance' | 'hybrid' | 'team_sport' | 'recreational';
export type GenderType = 'male' | 'female' | 'other';
export type FrequencyType = 'rarely' | 'sometimes' | 'regular';

export interface LimitationCategory {
  energy_recovery: string[];
  sleep_stress: string[];
  muscles_joints: string[];
  cognition_digestion: string[];
}

export interface RecoveryMethod {
  active: boolean;
  frequency?: FrequencyType;
}

export interface RecoveryMethods {
  rest_days: RecoveryMethod;
  stretching_mobility: RecoveryMethod;
  massage_foam_rolling: RecoveryMethod;
  sauna_cold: RecoveryMethod;
  active_recovery: RecoveryMethod;
  no_structured_recovery: RecoveryMethod;
}

export type NutritionPattern =
  | 'balanced'
  | 'high_protein'
  | 'vegetarian'
  | 'vegan'
  | 'low_carb'
  | 'carnivore'
  | 'minimal_processed'
  | 'irregular';

export interface PerformanceFormData {
  // Step 1: Basic Profile
  age: number | null;
  gender: GenderType | null;
  heightCm: number | null;
  weightKg: number | null;
  primarySportType: SportType | null;

  // Step 2: Goals
  primaryGoal: string;
  primaryGoalTimelineMonths: number | null;
  secondaryGoals: string[];

  // Step 3: Current Limitations
  currentLimitations: LimitationCategory;

  // Step 4: Recovery/Wellbeing
  sleepHoursPerNight: number;
  stressLevel: number;

  // Step 5: Nutrition
  dailyCalorieIntake: number;
  nutritionPatterns: NutritionPattern[];

  // Step 6: Recovery Methods
  recoveryMethods: RecoveryMethods;

  // Step 7: Training Load
  trainingHoursPerWeek: number;
  highIntensitySessionsPerWeek: number;

  // Step 8: Current Level
  currentLevelDescription: string;
  secondaryGoalCurrentLevels: string[];
}

export const INITIAL_FORM_DATA: PerformanceFormData = {
  // Step 1
  age: null,
  gender: null,
  heightCm: null,
  weightKg: null,
  primarySportType: null,

  // Step 2
  primaryGoal: '',
  primaryGoalTimelineMonths: null,
  secondaryGoals: ['', ''],

  // Step 3
  currentLimitations: {
    energy_recovery: [],
    sleep_stress: [],
    muscles_joints: [],
    cognition_digestion: [],
  },

  // Step 4
  sleepHoursPerNight: 7.5,
  stressLevel: 5,

  // Step 5
  dailyCalorieIntake: 2500,
  nutritionPatterns: [],

  // Step 6
  recoveryMethods: {
    rest_days: { active: false },
    stretching_mobility: { active: false },
    massage_foam_rolling: { active: false },
    sauna_cold: { active: false },
    active_recovery: { active: false },
    no_structured_recovery: { active: false },
  },

  // Step 7
  trainingHoursPerWeek: 7,
  highIntensitySessionsPerWeek: 2,

  // Step 8
  currentLevelDescription: '',
  secondaryGoalCurrentLevels: ['', ''],
};

export const STEP_LABELS = [
  'Profiel',
  'Doelen',
  'Beperkingen',
  'Herstel',
  'Voeding',
  'Training',
  'Niveau',
];

export const SPORT_TYPES: { value: SportType; label: string }[] = [
  { value: 'strength', label: 'Kracht' },
  { value: 'endurance', label: 'Endurance' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'team_sport', label: 'Teamsport' },
  { value: 'recreational', label: 'Recreatief' },
];

export { GENDER_OPTIONS } from '@consts';

export const LIMITATION_CATEGORIES = {
  energy_recovery: {
    label: 'Energie & Herstel',
    options: [
      { value: 'chronic_fatigue', label: 'Chronische vermoeidheid' },
      { value: 'low_energy', label: 'Lage energie' },
      { value: 'slow_recovery', label: 'Langzaam herstel' },
    ],
  },
  sleep_stress: {
    label: 'Slaap & Stress',
    options: [
      { value: 'poor_sleep', label: 'Slechte slaap' },
      { value: 'high_stress', label: 'Hoge stress' },
      { value: 'mood_swings', label: 'Stemmingswisselingen' },
    ],
  },
  muscles_joints: {
    label: 'Spieren & Gewrichten',
    options: [
      { value: 'joint_pain', label: 'Pijn in gewrichten' },
      { value: 'frequent_injuries', label: 'Frequente blessures' },
      { value: 'muscle_pain', label: 'Spierpijn' },
    ],
  },
  cognition_digestion: {
    label: 'Cognitie & Spijsvertering',
    options: [
      { value: 'concentration_problems', label: 'Concentratieproblemen' },
      { value: 'digestive_issues', label: 'Spijsverteringsproblemen' },
    ],
  },
};

export const NUTRITION_PATTERNS: { value: NutritionPattern; label: string }[] = [
  { value: 'balanced', label: 'Balanced' },
  { value: 'high_protein', label: 'High Protein' },
  { value: 'vegetarian', label: 'Vegetarisch' },
  { value: 'vegan', label: 'Veganistisch' },
  { value: 'low_carb', label: 'Low Carb' },
  { value: 'carnivore', label: 'Carnivoor' },
  { value: 'minimal_processed', label: 'Minimaal Bewerkt' },
  { value: 'irregular', label: 'Onregelmatig' },
];

export const RECOVERY_METHODS: {
  key: keyof RecoveryMethods;
  label: string;
  hasFrequency: boolean;
}[] = [
  { key: 'rest_days', label: 'Rustdagen', hasFrequency: true },
  { key: 'stretching_mobility', label: 'Stretching / Mobiliteit', hasFrequency: true },
  { key: 'massage_foam_rolling', label: 'Massage / Foam Rolling', hasFrequency: true },
  { key: 'sauna_cold', label: 'Sauna / Koude', hasFrequency: true },
  { key: 'active_recovery', label: 'Actief Herstel', hasFrequency: true },
  { key: 'no_structured_recovery', label: 'Geen Gestructureerd Herstel', hasFrequency: false },
];

export const FREQUENCY_OPTIONS: { value: FrequencyType; label: string }[] = [
  { value: 'rarely', label: 'Zelden' },
  { value: 'sometimes', label: 'Soms' },
  { value: 'regular', label: 'Regelmatig' },
];

// Performance Tips Types
export type TipCategory = 'training' | 'voeding' | 'supplementen' | 'lifestyle' | 'herstel';

export interface PerformanceTip {
  id: string;
  category: TipCategory;
  title: string;
  description: string;
  source_url?: string;
}

export interface GoalTips {
  goal: string;
  tips: PerformanceTip[];
}

export interface PerformanceTipsData {
  tips_by_goal: Record<string, GoalTips>;
  selected_tip_ids?: string[];
}

export const TIP_CATEGORY_LABELS: Record<TipCategory, string> = {
  training: 'Training',
  voeding: 'Voeding',
  supplementen: 'Supplementen',
  lifestyle: 'Lifestyle',
  herstel: 'Recovery',
};

// Legacy plan types (kept for backwards compatibility)
export interface PlanItem {
  title: string;
  description: string;
}

export interface PerformancePlan {
  training: PlanItem[];
  lifestyle: PlanItem[];
  nutrition: PlanItem[];
  supplements: PlanItem[];
}

export type PlanCategory = 'training' | 'lifestyle' | 'nutrition' | 'supplements';

export const PLAN_CATEGORIES: { key: PlanCategory; label: string }[] = [
  { key: 'training', label: 'TRAINING' },
  { key: 'lifestyle', label: 'LIFESTYLE' },
  { key: 'nutrition', label: 'NUTRITION' },
  { key: 'supplements', label: 'SUPPLEMENTS' },
];
