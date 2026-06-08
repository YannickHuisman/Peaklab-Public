import { Button } from '@components/Button/Button';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexRow } from '@components/styled/layout';
import { useTranslation } from '@helpers/i18n';

export function RegenerateSection({
  canGenerate,
  nextAvailableDate,
  onRegenerate,
}: {
  canGenerate: boolean;
  nextAvailableDate: Date | null;
  onRegenerate: () => void;
}) {
  const { t } = useTranslation();

  return (
    <FlexRow $justify="center" $align="center" $gap="md" $padding="lg">
      {canGenerate && (
        <Button $variant="secondary" $size="small" onClick={onRegenerate}>
          <FlexRow $gap="xs" $align="center">
            <Icons.RefreshCw size="xs" />
            <span>{t('Nieuw rapport genereren')}</span>
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
