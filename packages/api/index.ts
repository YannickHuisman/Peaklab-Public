// Re-export app data types for root-only import
// Export auth-related items
export { setApiBaseUrl } from './config';
export { AppDataContext } from './context/AppDataContext';
export { AuthContext } from './context/AuthContext';
export { DataContext } from './context/DataContext';
export { useAI } from './hooks/useAI';
export { useAppData } from './hooks/useAppData';
export { useAuth } from './hooks/useAuth';
export type { Conversation, ConversationMessage } from './hooks/useChat';
export { useChat } from './hooks/useChat';
export { useData } from './hooks/useData';
export type {
  DeepResearchReport,
  Domain,
  DomainBiomarker,
  PerformanceImpact,
  Ratio,
  Recommendation,
  ReportData,
  ReportSummary,
} from './hooks/useDeepResearch';
export { useDeepResearch } from './hooks/useDeepResearch';
export type {
  AppDataContextType,
  BiomarkerCategory,
  BiomarkerWithConfig,
  DutchRegion,
  Partner,
  PartnerType,
  ScientificSource,
  TrainerSpecialization,
} from './types/appData';
export type { AuthContextProps, UserProfile } from './types/auth';
export type {
  Achievement,
  AchievementCategory,
  Appointment,
  AppointmentStatus,
  AppointmentType,
  AppointmentWithUser,
  Biomarker,
  BiomarkerCategoryReference,
  BiomarkerHistoryEntry,
  BiomarkerResult,
  DataContextType,
  DataProviderProps,
  Goal,
  LatestTest,
  Panel,
  PanelBiomarker,
  PeakScore,
  Performance,
  PerformanceProfileData,
  PerformanceProfileState,
  Profile,
} from './types/data';
export { authenticatedFetch } from './utils/authenticatedFetch';
