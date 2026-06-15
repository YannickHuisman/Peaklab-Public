import { Button } from '@components/Button/Button';
import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { useTranslation } from '@helpers/i18n';

import { useDeepResearch } from '@package/api';
import { theme } from '@package/ui';

interface FailedStateProps {
  errorMessage: string | null;
  createdAt: string;
}

export function FailedState({ errorMessage, createdAt }: FailedStateProps) {
  const { t } = useTranslation();
  const { canGenerate, generating, generateReport } = useDeepResearch();

  const formattedDate = new Date(createdAt).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <StyledCard $variant="section" $tone="error" $noShadow>
      <FlexColumn $gap="md" $align="flex-start">
        <FlexRow $gap="sm" $align="center">
          <Icons.AlertCircle size={20} color={theme.colors.error.strong} />
          <Heading $size="small" $weight={600}>
            {t('Rapport genereren mislukt')}
          </Heading>
        </FlexRow>

        <Paragraph $variant="secondary" $size="small">
          {errorMessage ||
            t('Er is een onbekende fout opgetreden tijdens het genereren van het rapport.')}
        </Paragraph>

        <Paragraph $variant="tertiary" $size="xsmall">
          {t('Poging op')} {formattedDate}
        </Paragraph>

        {canGenerate && (
          <Button $variant="primary" $size="small" onClick={generateReport} disabled={generating}>
            <FlexRow $gap="xs" $align="center">
              <Icons.RefreshCw size="xs" />
              <span>{generating ? t('Bezig met genereren…') : t('Opnieuw proberen')}</span>
            </FlexRow>
          </Button>
        )}
      </FlexColumn>
    </StyledCard>
  );
}
