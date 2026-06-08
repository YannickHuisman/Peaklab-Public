import { Heading } from '@components/Heading';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { useTranslation } from '@helpers/i18n';

import { StyledGeneratingRing, StyledGeneratingWrapper } from '../styles';

export function GeneratingState() {
  const { t } = useTranslation();

  return (
    <StyledCard $variant="section">
      <StyledGeneratingWrapper>
        <StyledGeneratingRing />

        <FlexColumn $gap="sm" $align="center">
          <Heading $size="small">{t('Analyse wordt gegenereerd')}</Heading>
          <Paragraph $variant="secondary" $size="small" $maxWidth="400px">
            {t(
              'We voeren een diepgaand onderzoek uit op basis van je biomarkers met behulp van AI-gestuurde research. Dit kan 5 tot 15 minuten duren. Je ontvangt een notificatie zodra het rapport klaar is.'
            )}
          </Paragraph>
        </FlexColumn>
      </StyledGeneratingWrapper>
    </StyledCard>
  );
}
