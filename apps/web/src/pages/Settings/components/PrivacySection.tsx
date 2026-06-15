import { Divider } from '@components/Divider';
import { Select } from '@components/form/Select';
import { Heading } from '@components/Heading';
import { Paragraph } from '@components/Paragraph';
import { StyledCard } from '@components/styled/StyledCard';

import { type UserSettings } from '../../../context/SettingsProvider';
import {
  StyledSection,
  StyledSectionBlockTitle,
  StyledSettingLabel,
  StyledSettingRow,
  StyledToggle,
} from '../styles';

export function PrivacySection({
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
            {t('Gegevensgebruik')}
          </Heading>
          <Paragraph $variant="secondary" $size="small">
            {t('Beheer hoe jouw gegevens worden gebruikt binnen het platform.')}
          </Paragraph>
        </StyledSectionBlockTitle>

        <StyledSettingRow>
          <StyledSettingLabel>
            <Paragraph $weight={500}>{t('Analytische cookies')}</Paragraph>
            <Paragraph $variant="secondary" $size="small">
              {t('Sta toe dat wij anonieme gebruiksdata verzamelen om het platform te verbeteren.')}
            </Paragraph>
          </StyledSettingLabel>
          <StyledToggle
            type="button"
            $enabled={settings.analytics_enabled}
            onClick={() => onUpdate({ analytics_enabled: !settings.analytics_enabled })}
            role="switch"
            aria-checked={settings.analytics_enabled}
            aria-label={t('Analytische cookies')}
          />
        </StyledSettingRow>

        <Divider />

        <StyledSettingRow>
          <StyledSettingLabel>
            <Paragraph $weight={500}>{t('Gepersonaliseerde aanbevelingen')}</Paragraph>
            <Paragraph $variant="secondary" $size="small">
              {t('Gebruik jouw gezondheidsdata voor persoonlijke inzichten en aanbevelingen.')}
            </Paragraph>
          </StyledSettingLabel>
          <StyledToggle
            type="button"
            $enabled={settings.personalised_recommendations}
            onClick={() =>
              onUpdate({ personalised_recommendations: !settings.personalised_recommendations })
            }
            role="switch"
            aria-checked={settings.personalised_recommendations}
            aria-label={t('Gepersonaliseerde aanbevelingen')}
          />
        </StyledSettingRow>

        <Divider />

        <StyledSettingRow>
          <StyledSettingLabel>
            <Paragraph $weight={500}>{t('Gegevens delen met partners')}</Paragraph>
            <Paragraph $variant="secondary" $size="small">
              {t('Sta geanonimiseerde gegevens toe te delen met PeakLab-partners voor onderzoek.')}
            </Paragraph>
          </StyledSettingLabel>
          <StyledToggle
            type="button"
            $enabled={settings.share_data_with_partners}
            onClick={() =>
              onUpdate({ share_data_with_partners: !settings.share_data_with_partners })
            }
            role="switch"
            aria-checked={settings.share_data_with_partners}
            aria-label={t('Gegevens delen met partners')}
          />
        </StyledSettingRow>
      </StyledCard>

      <StyledCard $variant="section" $gap="md">
        <StyledSectionBlockTitle>
          <Heading $size="small" $weight={600}>
            {t('Zichtbaarheid')}
          </Heading>
          <Paragraph $variant="secondary" $size="small">
            {t('Bepaal wie jouw activiteit kan zien.')}
          </Paragraph>
        </StyledSectionBlockTitle>

        <Select
          label={t('Activiteitszichtbaarheid')}
          value={settings.activity_visibility}
          onChange={(e) => onUpdate({ activity_visibility: e.target.value })}
          options={[
            { value: 'private', label: t('Privé (alleen jij)') },
            { value: 'friends', label: t('Vrienden') },
            { value: 'public', label: t('Openbaar') },
          ]}
        />
      </StyledCard>
    </StyledSection>
  );
}
