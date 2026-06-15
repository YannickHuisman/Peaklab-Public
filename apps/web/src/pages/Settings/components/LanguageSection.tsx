import { Select } from '@components/form/Select';
import { Heading } from '@components/Heading';
import { Paragraph } from '@components/Paragraph';
import { StyledCard } from '@components/styled/StyledCard';

import { type UserSettings } from '../../../context/SettingsProvider';
import { StyledSection, StyledSectionBlockTitle } from '../styles';

export function LanguageSection({
  settings,
  onUpdate,
  t,
}: {
  settings: UserSettings;
  onUpdate: (partial: Partial<UserSettings>) => void;
  t: (text: string) => string;
}) {
  return (
    <StyledSection>
      <StyledCard $variant="section" $gap="md">
        <StyledSectionBlockTitle>
          <Heading $size="small" $weight={600}>
            {t('Taal')}
          </Heading>
          <Paragraph $variant="secondary" $size="small">
            {t('Kies de taal voor de interface.')}
          </Paragraph>
        </StyledSectionBlockTitle>

        <Select
          label={t('Taal')}
          value={settings.language}
          onChange={(e) => onUpdate({ language: e.target.value })}
          options={[
            { value: 'nl', label: 'Nederlands' },
            { value: 'en', label: 'English' },
          ]}
        />

        <Select
          label={t('Regio')}
          value={settings.region}
          onChange={(e) => onUpdate({ region: e.target.value })}
          options={[
            { value: 'NL', label: t('Nederland') },
            { value: 'BE', label: t('België') },
            { value: 'DE', label: t('Duitsland') },
            { value: 'GB', label: t('Verenigd Koninkrijk') },
            { value: 'US', label: t('Verenigde Staten') },
          ]}
        />
      </StyledCard>

      <StyledCard $variant="section" $gap="md">
        <StyledSectionBlockTitle>
          <Heading $size="small" $weight={600}>
            {t('Eenheden & Opmaak')}
          </Heading>
          <Paragraph $variant="secondary" $size="small">
            {t('Pas meetstelsels en datumopmaak aan.')}
          </Paragraph>
        </StyledSectionBlockTitle>

        <Select
          label={t('Maatstelsel')}
          value={settings.units}
          onChange={(e) => onUpdate({ units: e.target.value })}
          options={[
            { value: 'metric', label: t('Metrisch (kg, cm)') },
            { value: 'imperial', label: t('Imperiaal (lbs, inch)') },
          ]}
        />

        <Select
          label={t('Datumopmaak')}
          value={settings.date_format}
          onChange={(e) => onUpdate({ date_format: e.target.value })}
          options={[
            { value: 'dd/mm/yyyy', label: 'DD/MM/YYYY' },
            { value: 'mm/dd/yyyy', label: 'MM/DD/YYYY' },
            { value: 'yyyy-mm-dd', label: 'YYYY-MM-DD' },
          ]}
        />
      </StyledCard>

      <StyledCard $variant="section" $gap="md">
        <StyledSectionBlockTitle>
          <Heading $size="small" $weight={600}>
            {t('Weergave')}
          </Heading>
          <Paragraph $variant="secondary" $size="small">
            {t('Kies het uiterlijk van de interface.')}
          </Paragraph>
        </StyledSectionBlockTitle>

        <Select
          label={t('Thema')}
          value={settings.theme}
          onChange={(e) => onUpdate({ theme: e.target.value })}
          options={[
            { value: 'light', label: t('Licht') },
            { value: 'dark', label: t('Donker') },
            { value: 'system', label: t('Systeemvoorkeur') },
          ]}
        />
      </StyledCard>
    </StyledSection>
  );
}
