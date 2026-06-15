import type {
  Achievement,
  AchievementCategory,
  Appointment,
  BiomarkerHistoryEntry,
  BiomarkerResult,
  Goal,
  LatestTest,
  PeakScore,
  Performance,
  PerformanceProfileData,
  PerformanceProfileState,
} from '@package/types';

export type {
  Achievement,
  AchievementCategory,
  Appointment,
  AppointmentStatus,
  AppointmentType,
  AppointmentWithUser,
  Biomarker,
  BiomarkerCategoryReference,
  BiomarkerDependency,
  BiomarkerHistoryEntry,
  BiomarkerKind,
  BiomarkerResult,
  Goal,
  LatestTest,
  Panel,
  PanelBiomarker,
  PeakScore,
  Performance,
  PerformanceProfileData,
  PerformanceProfileState,
  Profile,
  ScientificSource,
} from '@package/types';

export interface DataContextType {
  loading: boolean;
  latestTest: LatestTest | null;
  biomarkers: BiomarkerResult[];
  userGender: 'male' | 'female' | 'other' | null;
  goals: Goal[];
  performances: Performance[];
  peakScores: PeakScore[];
  bloodTests: Record<string, unknown>[];
  biomarkerHistory: Record<number, BiomarkerHistoryEntry[]>;
  fetchBiomarkerHistory: (biomarkerId: number) => Promise<void>;
  performanceProfile: PerformanceProfileState;
  fetchPerformanceProfile: () => Promise<PerformanceProfileData | null>;
  savePerformanceProfile: (data: {
    form_data: unknown;
    ai_plan?: unknown;
    ai_plan_provider?: string;
  }) => Promise<boolean>;
  invalidatePerformanceProfile: () => void;
  appointments: Appointment[];
  lastAppointment: Appointment | null;
  nextAppointment: Appointment | null;
  appointmentsLoading: boolean;
  fetchAppointments: () => Promise<void>;
  achievements: Achievement[];
  achievementsLoading: boolean;
  fetchAchievements: () => Promise<void>;
  addAchievement: (data: {
    category: AchievementCategory;
    title: string;
    value: string;
    reps?: number;
    achieved_at: string;
  }) => Promise<Achievement | null>;
  removeAchievement: (id: string) => Promise<boolean>;
}

export interface DataProviderProps {
  children: React.ReactNode;
}
