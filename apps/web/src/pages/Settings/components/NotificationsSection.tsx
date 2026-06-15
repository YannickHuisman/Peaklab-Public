import { Divider } from '@components/Divider';
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

export function NotificationsSection({
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
            {t('E-mailmeldingen')}
          </Heading>
          <Paragraph $variant="secondary" $size="small">
            {t('Kies welke e-mails je wilt ontvangen.')}
          </Paragraph>
        </StyledSectionBlockTitle>

        <StyledSettingRow>
          <StyledSettingLabel>
            <Paragraph $weight={500}>{t('Wekelijks rapport')}</Paragraph>
            <Paragraph $variant="secondary" $size="small">
              {t('Overzicht van jouw voortgang elke week.')}
            </Paragraph>
          </StyledSettingLabel>
          <StyledToggle
            type="button"
            $enabled={settings.email_weekly_report}
            onClick={() => onUpdate({ email_weekly_report: !settings.email_weekly_report })}
            role="switch"
            aria-checked={settings.email_weekly_report}
            aria-label={t('Wekelijks rapport')}
          />
        </StyledSettingRow>

        <Divider />

        <StyledSettingRow>
          <StyledSettingLabel>
            <Paragraph $weight={500}>{t('Nieuwe testresultaten')}</Paragraph>
            <Paragraph $variant="secondary" $size="small">
              {t('Ontvang een melding zodra nieuwe bloedresultaten beschikbaar zijn.')}
            </Paragraph>
          </StyledSettingLabel>
          <StyledToggle
            type="button"
            $enabled={settings.email_new_results}
            onClick={() => onUpdate({ email_new_results: !settings.email_new_results })}
            role="switch"
            aria-checked={settings.email_new_results}
            aria-label={t('Nieuwe testresultaten')}
          />
        </StyledSettingRow>

        <Divider />

        <StyledSettingRow>
          <StyledSettingLabel>
            <Paragraph $weight={500}>{t('Afspraakherinneringen')}</Paragraph>
            <Paragraph $variant="secondary" $size="small">
              {t('Ontvang herinneringen voor geplande afspraken.')}
            </Paragraph>
          </StyledSettingLabel>
          <StyledToggle
            type="button"
            $enabled={settings.email_appointment_reminders}
            onClick={() =>
              onUpdate({ email_appointment_reminders: !settings.email_appointment_reminders })
            }
            role="switch"
            aria-checked={settings.email_appointment_reminders}
            aria-label={t('Afspraakherinneringen')}
          />
        </StyledSettingRow>
      </StyledCard>

      <StyledCard $variant="section" $gap="md">
        <StyledSectionBlockTitle>
          <Heading $size="small" $weight={600}>
            {t('Pushmeldingen')}
          </Heading>
          <Paragraph $variant="secondary" $size="small">
            {t('Beheer meldingen op je apparaat.')}
          </Paragraph>
        </StyledSectionBlockTitle>

        <StyledSettingRow>
          <StyledSettingLabel>
            <Paragraph $weight={500}>{t('Nieuwe resultaten')}</Paragraph>
            <Paragraph $variant="secondary" $size="small">
              {t('Direct een pushmelding bij nieuwe bloedresultaten.')}
            </Paragraph>
          </StyledSettingLabel>
          <StyledToggle
            type="button"
            $enabled={settings.push_new_results}
            onClick={() => onUpdate({ push_new_results: !settings.push_new_results })}
            role="switch"
            aria-checked={settings.push_new_results}
            aria-label={t('Nieuwe resultaten')}
          />
        </StyledSettingRow>

        <Divider />

        <StyledSettingRow>
          <StyledSettingLabel>
            <Paragraph $weight={500}>{t('Community-updates')}</Paragraph>
            <Paragraph $variant="secondary" $size="small">
              {t('Reacties en vermeldingen in de community.')}
            </Paragraph>
          </StyledSettingLabel>
          <StyledToggle
            type="button"
            $enabled={settings.push_community_updates}
            onClick={() => onUpdate({ push_community_updates: !settings.push_community_updates })}
            role="switch"
            aria-checked={settings.push_community_updates}
            aria-label={t('Community-updates')}
          />
        </StyledSettingRow>

        <Divider />

        <StyledSettingRow>
          <StyledSettingLabel>
            <Paragraph $weight={500}>{t('Marketing & aanbiedingen')}</Paragraph>
            <Paragraph $variant="secondary" $size="small">
              {t('Nieuws, promoties en productaanbevelingen van PeakLab.')}
            </Paragraph>
          </StyledSettingLabel>
          <StyledToggle
            type="button"
            $enabled={settings.push_marketing_updates}
            onClick={() => onUpdate({ push_marketing_updates: !settings.push_marketing_updates })}
            role="switch"
            aria-checked={settings.push_marketing_updates}
            aria-label={t('Marketing & aanbiedingen')}
          />
        </StyledSettingRow>
      </StyledCard>
    </StyledSection>
  );
}
