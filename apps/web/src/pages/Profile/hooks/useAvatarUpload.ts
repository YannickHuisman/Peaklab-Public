import { useCallback, useRef, useState } from 'react';

import { authenticatedFetch } from '@helpers/authenticatedFetch';
import { useTranslation } from '@helpers/i18n';

import type { Profile } from '@package/api';

interface UseAvatarUploadOptions {
  onSuccess: (profile: Profile, message: string) => void;
  onError: (message: string) => void;
}

export function useAvatarUpload({ onSuccess, onError }: UseAvatarUploadOptions) {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(
    async (file: File) => {
      try {
        setUploading(true);

        const payload = new FormData();

        payload.append('avatar', file);

        const response = await authenticatedFetch('/api/profile/avatar', {
          method: 'POST',
          body: payload,
        });

        if (!response.ok) {
          const errorData = await response.json();

          throw new Error(errorData.error || 'Upload failed');
        }

        const data = await response.json();

        onSuccess(data.profile, t('Profielfoto bijgewerkt'));
      } catch (err) {
        onError(err instanceof Error ? err.message : 'Upload mislukt.');
      } finally {
        setUploading(false);
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      }
    },
    [t, onSuccess, onError]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (file) upload(file);
    },
    [upload]
  );

  const remove = useCallback(async () => {
    try {
      setUploading(true);
      const response = await authenticatedFetch('/api/profile/avatar', { method: 'DELETE' });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.error || 'Delete failed');
      }

      const data = await response.json();

      onSuccess(data.profile, t('Profielfoto verwijderd'));
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Verwijderen mislukt.');
    } finally {
      setUploading(false);
    }
  }, [t, onSuccess, onError]);

  const openFilePicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const bindInput = {
    ref: inputRef,
    onChange: handleFileChange,
  };

  return { uploading, remove, openFilePicker, bindInput };
}
