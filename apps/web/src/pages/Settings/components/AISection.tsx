import { Divider } from '@components/Divider';
import { Heading } from '@components/Heading';
import { Paragraph } from '@components/Paragraph';
import { FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';

import { type AIProviderName, useSystemConfig } from '@package/api';

import { type UserSettings } from '../../../context/SettingsProvider';
import {
  StyledProviderButton,
  StyledSection,
  StyledSectionBlockTitle,
  StyledSettingLabel,
  StyledSettingRow,
  StyledToggle,
} from '../styles';

export function AISection({
  settings,
  onUpdate,
  t,
  isAdmin = false,
}: {
  settings: UserSettings;
  onUpdate: (partial: Partial<UserSettings>) => void;
  t: (text: string) => string;
  isAdmin?: boolean;
}) {
  const { provider, saving, updateProvider } = useSystemConfig();

  function handleProviderChange(next: AIProviderName) {
    if (next !== provider) void updateProvider(next);
  }

  return (
    <StyledSection>
      <StyledCard $variant="section" $gap="md">
        <StyledSectionBlockTitle>
          <Heading $size="small" $weight={600}>
            {t('AI-context')}
          </Heading>
          <Paragraph $variant="secondary" $size="small">
            {t(
              'Bepaal welke gegevens AI-functies mogen gebruiken voor persoonlijke antwoorden. Geldt voor de chatbot, het deep research rapport én je performance plan.'
            )}
          </Paragraph>
        </StyledSectionBlockTitle>

        <StyledSettingRow>
          <StyledSettingLabel>
            <Paragraph $weight={500}>{t('Profiel')}</Paragraph>
            <Paragraph $variant="secondary" $size="small">
              {t(
                'Deel je leeftijd, geslacht, sport en doelen met AI-functies. Zonder dit kunnen de chatbot en performance tips niet personaliseren.'
              )}
            </Paragraph>
          </StyledSettingLabel>
          <StyledToggle
            type="button"
            $enabled={settings.ai_context_profile}
            onClick={() => onUpdate({ ai_context_profile: !settings.ai_context_profile })}
            role="switch"
            aria-checked={settings.ai_context_profile}
            aria-label={t('Profiel')}
          />
        </StyledSettingRow>

        <Divider />

        <StyledSettingRow>
          <StyledSettingLabel>
            <Paragraph $weight={500}>{t('Biomarkers')}</Paragraph>
            <Paragraph $variant="secondary" $size="small">
              {t(
                'Deel de status van je biomarkers (alleen bereik-indeling, nooit exacte waardes) met AI-functies. Vereist voor het deep research rapport.'
              )}
            </Paragraph>
          </StyledSettingLabel>
          <StyledToggle
            type="button"
            $enabled={settings.ai_context_biomarkers}
            onClick={() => onUpdate({ ai_context_biomarkers: !settings.ai_context_biomarkers })}
            role="switch"
            aria-checked={settings.ai_context_biomarkers}
            aria-label={t('Biomarkers')}
          />
        </StyledSettingRow>

        <Divider />

        <StyledSettingRow>
          <StyledSettingLabel>
            <Paragraph $weight={500}>{t('Performance plan')}</Paragraph>
            <Paragraph $variant="secondary" $size="small">
              {t(
                'Deel je geselecteerde performance tips met AI-functies, zodat de chatbot kan verwijzen naar je actieve plan.'
              )}
            </Paragraph>
          </StyledSettingLabel>
          <StyledToggle
            type="button"
            $enabled={settings.ai_context_performance_plan}
            onClick={() =>
              onUpdate({ ai_context_performance_plan: !settings.ai_context_performance_plan })
            }
            role="switch"
            aria-checked={settings.ai_context_performance_plan}
            aria-label={t('Performance plan')}
          />
        </StyledSettingRow>
      </StyledCard>

      {isAdmin && (
        <StyledCard $variant="section" $gap="md">
          <StyledSectionBlockTitle>
            <Heading $size="small" $weight={600}>
              {t('AI-provider')}
            </Heading>
            <Paragraph $variant="secondary" $size="small">
              {t(
                'Selecteer de actieve AI-provider voor alle gebruikers. Alleen zichtbaar voor admins.'
              )}
            </Paragraph>
          </StyledSectionBlockTitle>

          <FlexRow $gap="sm">
            <StyledProviderButton
              $active={provider === 'mistral'}
              disabled={saving || provider === null}
              onClick={() => handleProviderChange('mistral')}
            >
              Mistral
            </StyledProviderButton>
            <StyledProviderButton
              $active={provider === 'openai'}
              disabled={saving || provider === null}
              onClick={() => handleProviderChange('openai')}
            >
              OpenAI
            </StyledProviderButton>
          </FlexRow>
        </StyledCard>
      )}
    </StyledSection>
  );
}
