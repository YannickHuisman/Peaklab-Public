import { Button } from '@components/Button/Button';
import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { useTranslation } from '@helpers/i18n';

import { useDeepResearch } from '@package/api';
import { theme } from '@package/ui';

export function EmptyState() {
  const { t } = useTranslation();
  const { canGenerate, nextAvailableDate, generating, generateReport } = useDeepResearch();

  return (
    <StyledCard $variant="intro" $tone="hero">
      <FlexColumn $gap="lg" $align="center" $padding="xl" style={{ textAlign: 'center' }}>
        <Icons.Brain size={48} color={theme.colors.primary} />

        <FlexColumn $gap="sm" $align="center">
          <Heading $size="large" $variant="inverse">
            {t('Deep Research AI Report')}
          </Heading>
          <Paragraph $variant="inverse" $maxWidth="560px" $opacity={0.8}>
            {t(
              'Ontvang een uitgebreide analyse van al je biomarkers. We groeperen je data per domein, berekenen belangrijke verhoudingen en genereren een persoonlijk verhaal over wat jouw bloedwaarden betekenen voor je performance.'
            )}
          </Paragraph>
        </FlexColumn>

        <FlexColumn $gap="xs" $align="center">
          <FlexRow $gap="md" $align="center" $flexWrap="wrap" $justify="center">
            <FlexRow $gap="xs" $align="center">
              <Icons.Activity size="xs" color={theme.colors.primary} />
              <Paragraph $size="small" $variant="inverse" $opacity={0.7}>
                {t('Domeinanalyse')}
              </Paragraph>
            </FlexRow>
            <FlexRow $gap="xs" $align="center">
              <Paragraph $size="small" $variant="inverse" $opacity={0.7}>
                {t("Ratio's & verbanden")}
              </Paragraph>
            </FlexRow>
            <FlexRow $gap="xs" $align="center">
              <Icons.Target size="xs" color={theme.colors.primary} />
              <Paragraph $size="small" $variant="inverse" $opacity={0.7}>
                {t('Actieplan')}
              </Paragraph>
            </FlexRow>
          </FlexRow>
        </FlexColumn>

        <Button
          $variant="primary"
          $size="large"
          onClick={generateReport}
          disabled={!canGenerate || generating}
        >
          <FlexRow $gap="sm" $align="center">
            <Icons.Sparkles size="xs" />
            <span>{generating ? t('Bezig met genereren…') : t('Genereer Deep Research')}</span>
          </FlexRow>
        </Button>

        {!canGenerate && nextAvailableDate && (
          <Paragraph $size="small" $variant="inverse" $opacity={0.6}>
            {t('Beschikbaar vanaf')}{' '}
            {nextAvailableDate.toLocaleDateString('nl-NL', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Paragraph>
        )}
      </FlexColumn>
    </StyledCard>
  );
}
