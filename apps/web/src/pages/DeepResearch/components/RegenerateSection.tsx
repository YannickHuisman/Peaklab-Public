import { Button } from '@components/Button/Button';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexRow } from '@components/styled/layout';
import { useTranslation } from '@helpers/i18n';

import { useDeepResearch } from '@package/api';

export function RegenerateSection() {
  const { t } = useTranslation();
  const { canGenerate, nextAvailableDate, generating, generateReport } = useDeepResearch();

  return (
    <FlexRow $justify="center" $align="center" $gap="md" $padding="lg">
      {canGenerate && (
        <Button $variant="secondary" $size="small" onClick={generateReport} disabled={generating}>
          <FlexRow $gap="xs" $align="center">
            <Icons.RefreshCw size="xs" />
            <span>{generating ? t('Bezig met genereren…') : t('Nieuw rapport genereren')}</span>
          </FlexRow>
        </Button>
      )}
      {!canGenerate && nextAvailableDate && (
        <Paragraph $size="small" $variant="tertiary">
          {t('Volgend rapport beschikbaar vanaf')}{' '}
          {nextAvailableDate.toLocaleDateString('nl-NL', {
            day: 'numeric',
            month: 'long',
          })}
        </Paragraph>
      )}
    </FlexRow>
  );
}
