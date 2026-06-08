import { Button } from '@components/Button';
import { Input } from '@components/form/Input';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { useTranslation } from '@helpers/i18n';

interface EditableTipsListProps {
  tips: string[];
  onAdd: () => void;
  onUpdate: (index: number, value: string) => void;
  onRemove: (index: number) => void;
  emptyMessage?: string;
}

export function EditableTipsList({
  tips,
  onAdd,
  onUpdate,
  onRemove,
  emptyMessage,
}: EditableTipsListProps) {
  const { t } = useTranslation();
  const empty = emptyMessage ?? t('Geen tips');

  return (
    <>
      <FlexRow $justify="space-between" $align="center">
        <Button type="button" $variant="ghost" $size="small" onClick={onAdd}>
          <Icons.Plus size="xs" /> {t('Tip toevoegen')}
        </Button>
      </FlexRow>
      <FlexColumn $gap="sm">
        {tips.map((tip, index) => (
          <FlexRow key={index} $gap="sm" $align="center">
            <Input
              value={tip}
              onChange={(e) => onUpdate(index, e.target.value)}
              placeholder={`Tip ${index + 1}...`}
              style={{ flex: 1 }}
            />
            <Button type="button" $variant="ghost" $size="small" onClick={() => onRemove(index)}>
              <Icons.Trash size="xs" />
            </Button>
          </FlexRow>
        ))}
        {tips.length === 0 && (
          <Paragraph $size="small" $variant="secondary">
            {empty}
          </Paragraph>
        )}
      </FlexColumn>
    </>
  );
}
