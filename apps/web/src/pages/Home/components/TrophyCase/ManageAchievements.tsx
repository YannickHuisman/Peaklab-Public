import { useState } from 'react';

import { Button } from '@components/Button';
import { Input } from '@components/form/Input';
import { Select } from '@components/form/Select';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { useToast } from '@context/ToastProvider';
import { useTranslation } from '@helpers/i18n';

import type { Achievement, AchievementCategory } from '@package/api';

import { StyledDeleteButton } from './styles';

interface ManageAchievementsProps {
  achievements: Achievement[];
  onAdd: (achievement: {
    category: AchievementCategory;
    title: string;
    value: string;
    reps?: number;
    achieved_at: string;
  }) => Promise<Achievement | null>;
  onRemove: (id: string) => Promise<boolean>;
}

export function ManageAchievements({ achievements, onAdd, onRemove }: ManageAchievementsProps) {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const CATEGORY_OPTIONS = [
    { value: 'algemeen', label: t('Algemeen') },
    { value: 'kracht', label: t('Kracht') },
    { value: 'hardlopen', label: t('Hardlopen') },
  ];

  const [category, setCategory] = useState<AchievementCategory>('algemeen');
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [reps, setReps] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !value.trim() || !date) return;

    const added = await onAdd({
      category,
      title: title.trim(),
      value: value.trim(),
      reps: reps ? Number(reps) : undefined,
      achieved_at: new Date(date).toISOString(),
    });

    // Only clear the form once the record was actually saved, so a failed
    // add doesn't wipe the user's input and look like it succeeded.
    if (!added) {
      showToast(t('Toevoegen van het record is mislukt. Probeer het opnieuw.'));

      return;
    }

    setTitle('');
    setValue('');
    setReps('');
  };

  const handleRemove = async (id: string) => {
    const ok = await onRemove(id);

    if (!ok) showToast(t('Verwijderen van het record is mislukt. Probeer het opnieuw.'));
  };

  const formatValue = (a: Achievement) => {
    if (a.category === 'kracht' && a.reps) return `${a.value} kg ×${a.reps}`;

    return a.value;
  };

  return (
    <FlexColumn $gap="lg">
      <form onSubmit={handleSubmit}>
        <FlexColumn $gap="sm">
          <FlexRow $gap="sm" $align="flex-end" $flexWrap="wrap">
            <div style={{ flex: 1 }}>
              <Select
                label="Categorie"
                options={CATEGORY_OPTIONS}
                value={category}
                onChange={(e) => setCategory(e.target.value as AchievementCategory)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Input
                label="Datum"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </FlexRow>
          <Input
            label="Titel"
            placeholder="bijv. Bench Press, Marathon Rotterdam"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <FlexRow $gap="sm" $align="flex-end" $flexWrap="wrap">
            <div style={{ flex: 2 }}>
              <Input
                label="Waarde"
                placeholder={
                  category === 'kracht'
                    ? 'bijv. 140'
                    : category === 'hardlopen'
                      ? 'bijv. 3:28:23'
                      : 'bijv. 01:23:00'
                }
                value={value}
                onChange={(e) => setValue(e.target.value)}
                suffix={category === 'kracht' ? 'kg' : undefined}
              />
            </div>
            {category === 'kracht' && (
              <div style={{ flex: 1 }}>
                <Input
                  label="Reps"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                />
              </div>
            )}
          </FlexRow>
          <Button
            type="submit"
            $variant="primary"
            $size="medium"
            $fullWidth
            $mt="sm"
            disabled={!title.trim() || !value.trim()}
          >
            <Icons.Plus size="sm" /> Toevoegen
          </Button>
        </FlexColumn>
      </form>

      {achievements.length > 0 && (
        <FlexColumn $gap="sm">
          <Paragraph $size="small" $weight={600} $variant="secondary">
            Jouw records ({achievements.length})
          </Paragraph>
          {achievements.map((a) => (
            <StyledCard key={a.id} $variant="small" $tone="subtle" $noShadow>
              <FlexRow $align="center" $justify="space-between">
                <FlexRow $gap="md" $align="center" $flex={1} $minWidth="0">
                  <FlexColumn $gap="xxs">
                    <Paragraph $size="xsmall" $variant="tertiary" $allCaps>
                      {a.category}
                    </Paragraph>
                    <FlexRow $gap="sm" $align="center" $width="auto">
                      <Paragraph $size="small" $weight={600}>
                        {a.title}
                      </Paragraph>
                      <Paragraph $weight={700} $whiteSpace="nowrap">
                        {formatValue(a)}
                      </Paragraph>
                    </FlexRow>
                  </FlexColumn>
                </FlexRow>
                <StyledDeleteButton
                  type="button"
                  onClick={() => handleRemove(a.id)}
                  aria-label={t('Verwijderen')}
                >
                  <Icons.Trash size="sm" />
                </StyledDeleteButton>
              </FlexRow>
            </StyledCard>
          ))}
        </FlexColumn>
      )}
    </FlexColumn>
  );
}
