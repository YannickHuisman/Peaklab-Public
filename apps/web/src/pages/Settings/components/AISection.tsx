import { Divider } from '@components/Divider';
import { Heading } from '@components/Heading';
import { Paragraph } from '@components/Paragraph';

import { type UserSettings } from '../../../context/SettingsProvider';
import {
  StyledSection,
  StyledSectionBlock,
  StyledSectionBlockTitle,
  StyledSettingLabel,
  StyledSettingRow,
  StyledToggle,
} from '../styles';

export function AISection({
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
      <StyledSectionBlock>
        <StyledSectionBlockTitle>
          <Heading $size="small" $weight={600}>
            {t('AI-context')}
          </Heading>
          <Paragraph $variant="secondary" $size="small">
            {t('Bepaal welke gegevens de AI-assistent mag gebruiken voor persoonlijke antwoorden.')}
          </Paragraph>
        </StyledSectionBlockTitle>

        <StyledSettingRow>
          <StyledSettingLabel>
            <Paragraph $weight={500}>{t('Profiel')}</Paragraph>
            <Paragraph $variant="secondary" $size="small">
              {t('Deel je leeftijd, geslacht, sport en doelen met de chatbot.')}
            </Paragraph>
          </StyledSettingLabel>
          <StyledToggle
            $enabled={settings.ai_context_profile}
            onClick={() => onUpdate({ ai_context_profile: !settings.ai_context_profile })}
            role="switch"
            aria-checked={settings.ai_context_profile}
          />
        </StyledSettingRow>

        <Divider />

        <StyledSettingRow>
          <StyledSettingLabel>
            <Paragraph $weight={500}>{t('Performance plan')}</Paragraph>
            <Paragraph $variant="secondary" $size="small">
              {t('Deel je geselecteerde performance tips met de chatbot.')}
            </Paragraph>
          </StyledSettingLabel>
          <StyledToggle
            $enabled={settings.ai_context_performance_plan}
            onClick={() =>
              onUpdate({ ai_context_performance_plan: !settings.ai_context_performance_plan })
            }
            role="switch"
            aria-checked={settings.ai_context_performance_plan}
          />
        </StyledSettingRow>
      </StyledSectionBlock>
    </StyledSection>
  );
}
