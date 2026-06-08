import { createContext } from 'react';

export interface UserSettings {
  language: string;
  region: string;
  units: string;
  date_format: string;
  theme: string;
  analytics_enabled: boolean;
  personalised_recommendations: boolean;
  share_data_with_partners: boolean;
  activity_visibility: string;
  email_weekly_report: boolean;
  email_new_results: boolean;
  email_appointment_reminders: boolean;
  push_new_results: boolean;
  push_community_updates: boolean;
  push_marketing_updates: boolean;
  ai_context_profile: boolean;
  ai_context_biomarkers: boolean;
  ai_context_performance_plan: boolean;
}

export interface SettingsContextType {
  settings: UserSettings;
  loading: boolean;
  saving: boolean;
  update: (partial: Partial<UserSettings>) => Promise<void>;
}

export const DEFAULT_SETTINGS: UserSettings = {
  language: 'nl',
  region: 'NL',
  units: 'metric',
  date_format: 'dd/mm/yyyy',
  theme: 'light',
  analytics_enabled: true,
  personalised_recommendations: true,
  share_data_with_partners: false,
  activity_visibility: 'private',
  email_weekly_report: true,
  email_new_results: true,
  email_appointment_reminders: true,
  push_new_results: true,
  push_community_updates: false,
  push_marketing_updates: false,
  ai_context_profile: true,
  ai_context_biomarkers: true,
  ai_context_performance_plan: true,
};

export const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  loading: true,
  saving: false,
  update: async () => {},
});
