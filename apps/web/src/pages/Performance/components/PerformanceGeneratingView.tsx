import { Heading } from '@components/Heading';
import { Loader } from '@components/Loader';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { useTranslation } from '@helpers/i18n';

/**
 * Shown while a performance plan is being generated (including after a reload,
 * when an in-flight job is resumed). Replaces the stepper so the user can't
 * accidentally start a second generation.
 */
export function PerformanceGeneratingView() {
  const { t } = useTranslation();

  return (
    <StyledCard $variant="section">
      <FlexColumn $gap="md" $align="center" $justify="center" $padding="2xl">
        <Loader />
        <FlexColumn $gap="xs" $align="center">
          <Heading $size="medium">{t('Je performance plan wordt gegenereerd')}</Heading>
          <Paragraph $variant="secondary" $align="center">
            {t('Dit kan enkele minuten duren. Je kunt deze pagina laten openstaan.')}
          </Paragraph>
        </FlexColumn>
      </FlexColumn>
    </StyledCard>
  );
}
