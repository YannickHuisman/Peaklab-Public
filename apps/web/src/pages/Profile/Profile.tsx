import { useCallback, useMemo, useState } from 'react';

import { Button } from '@components/Button/Button';
import { Icons } from '@components/Icons';
import { Loader } from '@components/Loader';
import { PageHeader } from '@components/PageHeader';
import { FlexColumn, FlexRow, Grid } from '@components/styled/layout';
import { SPORT_TYPE_OPTIONS } from '@consts';
import { authenticatedFetch } from '@helpers/authenticatedFetch';
import { formatDate } from '@helpers/formatDate';
import { useTranslation } from '@helpers/i18n';
import { useDeviceBreakpoints } from '@hooks/useDeviceBreakpoints';
import { useForm } from '@hooks/useForm';
import { useStatusMessage } from '@hooks/useStatusMessage';

import { useAuth } from '@package/api';

import { AvatarModal, MessageBanner, PersonalInfoCard, ProfileHeader } from './components';
import { useAvatarUpload, useProfileData } from './hooks';
import { StyledFileInput } from './styles';
import { type ProfileFormData, profileToFormData } from './types';

export function Profile() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isMobile } = useDeviceBreakpoints();

  const [editing, setEditing] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const { message, showSuccess, showError, clear, setMessage } = useStatusMessage();

  const form = useForm<ProfileFormData>({
    initialValues: profileToFormData(null),
    onSubmit: async (values) => {
      clear();

      const payload = {
        full_name: values.full_name || null,
        username: values.username || null,
        website: values.website || null,
        birth_date: values.birth_date || null,
        gender: values.gender || null,
        weight_kg: values.weight_kg ? Number(values.weight_kg) : null,
        sport_type: values.sport_type || null,
        sport_frequency_per_week: values.sport_frequency_per_week
          ? Number(values.sport_frequency_per_week)
          : null,
      };

      const response = await authenticatedFetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();

        showError(errorData.error || t('Profiel bijwerken mislukt'));

        return;
      }

      const data = await response.json();

      setProfile(data.profile);
      form.reset(profileToFormData(data.profile));
      setEditing(false);
      showSuccess(t('Profiel bijgewerkt'));
    },
  });

  const { profile, setProfile, loading } = useProfileData({
    resetForm: form.reset,
    onError: showError,
  });

  const { uploading, remove, openFilePicker, bindInput } = useAvatarUpload({
    onSuccess: (updated, msg) => {
      setProfile(updated);
      setAvatarModalOpen(false);
      showSuccess(msg);
    },
    onError: showError,
  });

  const handleCancel = useCallback(() => {
    form.reset(profileToFormData(profile));
    setEditing(false);
    setMessage(null);
  }, [profile, form, setMessage]);

  const memberSince = useMemo(() => {
    const createdAt = profile?.created_at;

    return createdAt ? formatDate(createdAt) : '-';
  }, [profile]);

  if (loading) {
    return (
      <FlexColumn $gap="lg" $flex={1}>
        <PageHeader title={t('Profiel')} subtitle={t('Beheer je persoonlijke gegevens')} />
        <Loader />
      </FlexColumn>
    );
  }

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Gebruiker';
  const sportLabel = SPORT_TYPE_OPTIONS.find((o) => o.value === profile?.sport_type)?.label ?? null;
  const frequencyLabel = profile?.sport_frequency_per_week
    ? `${profile.sport_frequency_per_week}x ${t('per week')}`
    : null;

  return (
    <FlexColumn $gap="lg">
      <FlexRow $justify="space-between" $align="center" $gap="md">
        <PageHeader title={t('Profiel')} subtitle={t('Beheer je persoonlijke gegevens')} />

        <FlexRow $gap="sm" $width="auto" $flexShrink={0}>
          {editing ? (
            <>
              <Button
                $variant="ghost"
                $size="small"
                onClick={handleCancel}
                disabled={form.isSubmitting}
              >
                {t('Annuleren')}
              </Button>
              <Button
                $variant="primary"
                $size="small"
                onClick={() => form.handleSubmit()}
                disabled={form.isSubmitting}
              >
                {form.isSubmitting ? (
                  t('Opslaan...')
                ) : (
                  <>
                    <Icons.Save size="sm" />
                    {t('Opslaan')}
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button $variant="secondary" $size="small" onClick={() => setEditing(true)}>
              <Icons.Edit size="sm" />
              {t('Bewerken')}
            </Button>
          )}
        </FlexRow>
      </FlexRow>

      {message && <MessageBanner type={message.type} text={message.text} />}

      <ProfileHeader
        profile={profile}
        email={user?.email}
        displayName={displayName}
        memberSince={memberSince}
        sportLabel={sportLabel}
        frequencyLabel={frequencyLabel}
        onAvatarClick={() => setAvatarModalOpen(true)}
      />

      <StyledFileInput
        {...bindInput}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
      />

      <Grid $gridColumns={isMobile ? '1fr' : '1fr 1fr'} $gap="lg" $align="start">
        <PersonalInfoCard profile={profile} editing={editing} form={form} />
      </Grid>

      <AvatarModal
        isOpen={avatarModalOpen}
        profile={profile}
        uploading={uploading}
        onClose={() => setAvatarModalOpen(false)}
        onUploadClick={openFilePicker}
        onDelete={remove}
      />
    </FlexColumn>
  );
}
