import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { GENDER_OPTIONS } from '@consts';
import { formatDate } from '@helpers/formatDate';
import { useTranslation } from '@helpers/i18n';

import type { Profile } from '@package/api';
import { theme } from '@package/ui';

import { StyledSectionTitleIcon } from '../styles';
import type { ProfileFormData } from '../types';
import { EditableField } from './EditableField';

type FormApi = {
  getFieldProps: (
    field: keyof ProfileFormData
  ) => Parameters<typeof EditableField>[0]['fieldProps'];
};

interface PersonalInfoCardProps {
  profile: Profile | null;
  editing: boolean;
  form: FormApi;
}

export function PersonalInfoCard({ profile, editing, form }: PersonalInfoCardProps) {
  const { t } = useTranslation();

  const genderLabel = GENDER_OPTIONS.find((o) => o.value === profile?.gender)?.label || '—';
  const birthDateLabel = profile?.birth_date ? formatDate(profile.birth_date) : '—';

  return (
    <StyledCard $gap="lg" $padding="xl">
      <FlexRow $align="center" $gap="sm" $width="auto">
        <StyledSectionTitleIcon $color={theme.colors.accent.blue.soft}>
          <Icons.User size="sm" color={theme.colors.accent.blue.main} />
        </StyledSectionTitleIcon>
        <Heading $size="xsmall" $weight={700}>
          {t('Persoonlijke gegevens')}
        </Heading>
      </FlexRow>

      <FlexColumn $gap="md">
        <EditableField
          label={t('Volledige naam')}
          editing={editing}
          fieldProps={form.getFieldProps('full_name')}
          displayValue={profile?.full_name || '—'}
          placeholder={t('Jouw naam')}
        />
        <EditableField
          label={t('Gebruikersnaam')}
          editing={editing}
          fieldProps={form.getFieldProps('username')}
          displayValue={profile?.username ? `@${profile.username}` : '—'}
          placeholder={t('Gebruikersnaam')}
        />
        <EditableField
          label={t('Geboortedatum')}
          type="date"
          editing={editing}
          fieldProps={form.getFieldProps('birth_date')}
          displayValue={birthDateLabel}
        />
        <EditableField
          label={t('Geslacht')}
          type="select"
          options={GENDER_OPTIONS}
          editing={editing}
          fieldProps={form.getFieldProps('gender')}
          displayValue={genderLabel}
          placeholder={t('Selecteer geslacht')}
        />
        <EditableField
          label={t('Website')}
          editing={editing}
          fieldProps={form.getFieldProps('website')}
          displayValue={profile?.website || '—'}
          placeholder="https://..."
        />
      </FlexColumn>
    </StyledCard>
  );
}

export type { FormApi };
