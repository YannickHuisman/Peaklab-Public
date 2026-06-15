// Re-export app data types for root-only import
// Export auth-related items
export { setApiBaseUrl } from './config';
export { AppDataContext } from './context/AppDataContext';
export { AuthContext } from './context/AuthContext';
export { DataContext } from './context/DataContext';
export { DeepResearchContext } from './context/DeepResearchContext';
export { useAI } from './hooks/useAI';
export { useAppData } from './hooks/useAppData';
export { useAuth } from './hooks/useAuth';
export type { Conversation, ConversationMessage } from './hooks/useChat';
export { useChat } from './hooks/useChat';
export { useData } from './hooks/useData';
export { useDeepResearch } from './hooks/useDeepResearch';
export type { Plan } from './hooks/usePlans';
export { formatPlanPrice, usePlans } from './hooks/usePlans';
export type { Subscription, SubscriptionStatus } from './hooks/useSubscription';
export { useSubscription } from './hooks/useSubscription';
export type { AIProviderName } from './hooks/useSystemConfig';
export { useSystemConfig } from './hooks/useSystemConfig';
export { getAuthToken, setAuthToken } from './tokenStore';
export type {
  AppDataContextType,
  BiomarkerCategory,
  BiomarkerWithConfig,
  ContactPreference,
  DutchRegion,
  Partner,
  PartnerLink,
  PartnerLinkType,
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
  BiomarkerDependency,
  BiomarkerHistoryEntry,
  BiomarkerKind,
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
export type {
  DeepResearchContextType,
  DeepResearchReport,
  Domain,
  DomainBiomarker,
  PerformanceImpact,
  RangeBucket,
  Ratio,
  Recommendation,
  ReportData,
  ReportSummary,
} from './types/deepResearch';
export { authenticatedFetch } from './utils/authenticatedFetch';
export { logError } from './utils/logError';
