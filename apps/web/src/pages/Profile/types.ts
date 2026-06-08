import type { Profile } from '@package/api';

export interface ProfileFormData {
  full_name: string;
  username: string;
  website: string;
  birth_date: string;
  gender: string;
  weight_kg: string;
  sport_type: string;
  sport_frequency_per_week: string;
}

export type StatusMessage = {
  type: 'success' | 'error';
  text: string;
} | null;

export function profileToFormData(profile: Profile | null): ProfileFormData {
  return {
    full_name: profile?.full_name ?? '',
    username: profile?.username ?? '',
    website: profile?.website ?? '',
    birth_date: profile?.birth_date ?? '',
    gender: profile?.gender ?? '',
    weight_kg:
      profile?.weight_kg !== null && profile?.weight_kg !== undefined
        ? String(profile.weight_kg)
        : '',
    sport_type: profile?.sport_type ?? '',
    sport_frequency_per_week:
      profile?.sport_frequency_per_week !== null && profile?.sport_frequency_per_week !== undefined
        ? String(profile.sport_frequency_per_week)
        : '',
  };
}
