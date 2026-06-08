import { Button } from '@components/Button';
import { Input } from '@components/form/Input';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { useTranslation } from '@helpers/i18n';

import type { ScientificSource } from '@package/api';
import { theme } from '@package/ui';

interface EditableSourcesListProps {
  sources: ScientificSource[];
  onAdd: () => void;
  onUpdate: (index: number, field: keyof ScientificSource, value: string) => void;
  onRemove: (index: number) => void;
  emptyMessage?: string;
}

export function EditableSourcesList({
  sources,
  onAdd,
  onUpdate,
  onRemove,
  emptyMessage,
}: EditableSourcesListProps) {
  const { t } = useTranslation();
  const empty = emptyMessage ?? t('Geen bronnen');

  return (
    <>
      <FlexRow $justify="space-between" $align="center">
        <Button type="button" $variant="ghost" $size="small" onClick={onAdd}>
          <Icons.Plus size="xs" /> {t('Bron toevoegen')}
        </Button>
      </FlexRow>
      <FlexColumn $gap="sm">
        {sources.map((source, index) => (
          <FlexColumn
            key={index}
            $gap="xs"
            style={{
              paddingBottom: theme.spacing.sm,
              borderBottom: `1px solid ${theme.colors.border.subtle}`,
            }}
          >
            <FlexRow $gap="sm" $align="center">
              <Input
                value={source.title}
                onChange={(e) => onUpdate(index, 'title', e.target.value)}
                placeholder={t('URL of titel')}
                style={{ flex: 1 }}
              />
              <Button type="button" $variant="ghost" $size="small" onClick={() => onRemove(index)}>
                <Icons.Trash size="xs" />
              </Button>
            </FlexRow>
            <Input
              value={source.url}
              onChange={(e) => onUpdate(index, 'url', e.target.value)}
              placeholder="https://..."
            />
          </FlexColumn>
        ))}
        {sources.length === 0 && (
          <Paragraph $size="small" $variant="secondary">
            {empty}
          </Paragraph>
        )}
      </FlexColumn>
    </>
  );
}
