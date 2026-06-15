import { useCallback, useEffect, useRef, useState } from 'react';

import { authenticatedFetch } from '@helpers/authenticatedFetch';
import { useTranslation } from '@helpers/i18n';

import type { Profile } from '@package/api';

import { type ProfileFormData, profileToFormData } from '../types';

interface UseProfileDataOptions {
  resetForm: (values: ProfileFormData) => void;
  onError: (text: string) => void;
}

export function useProfileData({ resetForm, onError }: UseProfileDataOptions) {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const resetFormRef = useRef(resetForm);
  const onErrorRef = useRef(onError);

  resetFormRef.current = resetForm;
  onErrorRef.current = onError;

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await authenticatedFetch('/api/profile');

      if (!response.ok) throw new Error('Failed to fetch profile');

      const data = await response.json();

      setProfile(data.profile);
      resetFormRef.current(profileToFormData(data.profile));
    } catch {
      onErrorRef.current(t('Profiel laden mislukt'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, setProfile, loading };
}
