import { useMemo } from 'react';

import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { useModal } from '@context/ModalProvider';
import { formatDate } from '@helpers/formatDate';
import { useTranslation } from '@helpers/i18n';

import type { Achievement } from '@package/api';
import { useData } from '@package/api';

import { ManageAchievements } from './ManageAchievements';
import { StyledHeaderLink, StyledRecordAccent, StyledRecordItem } from './styles';
import { ACHIEVEMENT_CATEGORIES } from './types';

function formatAchievementValue(a: Achievement) {
  if (a.category === 'kracht' && a.reps) {
    return `${a.value} kg ×${a.reps}`;
  }

  return a.value;
}

export function TrophyCase() {
  const { t } = useTranslation();

  const { achievements, addAchievement, removeAchievement } = useData();
  const { openModal } = useModal();

  const sorted = useMemo(
    () =>
      [...achievements].sort(
        (a, b) => new Date(b.achieved_at).getTime() - new Date(a.achieved_at).getTime()
      ),
    [achievements]
  );

  const mostRecent = sorted[0] ?? null;
  const otherRecords = sorted.slice(1);

  const handleManage = () => {
    openModal({
      title: t('Records beheren'),
      size: 'medium',
      content: (
        <ManageAchievements
          achievements={sorted}
          onAdd={addAchievement}
          onRemove={removeAchievement}
        />
      ),
    });
  };

  return (
    <StyledCard $variant="section">
      <FlexRow $justify="space-between" $align="baseline" $mb="lg">
        <Heading $size="xsmall" $weight={700}>
          {t('Trophy Case')}
        </Heading>
        <StyledHeaderLink type="button" onClick={handleManage}>
          {t('Beheren')}
        </StyledHeaderLink>
      </FlexRow>

      {mostRecent ? (
        <>
          <StyledCard $variant="small" $tone="subtle" $noShadow $mb="sm">
            <FlexRow $justify="space-between" $align="flex-start" $gap="md">
              <FlexColumn style={{ flex: 1, minWidth: 0 }}>
                <Paragraph $size="xsmall" $variant="tertiary" $allCaps>
                  {t('Meest recent')}
                </Paragraph>
                <Paragraph $size="small" $weight={600} $mt="xxs">
                  {mostRecent.title}
                </Paragraph>
                <Paragraph $size="xsmall" $variant="tertiary" $allCaps>
                  {ACHIEVEMENT_CATEGORIES[mostRecent.category]}
                </Paragraph>
              </FlexColumn>
              <FlexColumn $align="flex-end" $flexShrink={0}>
                <Heading $size="medium" $weight={700}>
                  {formatAchievementValue(mostRecent)}
                </Heading>
                <Paragraph $size="xsmall" $variant="tertiary" $mt="xs">
                  {formatDate(mostRecent.achieved_at, { preset: 'shortDate' })}
                </Paragraph>
              </FlexColumn>
            </FlexRow>
          </StyledCard>

          {otherRecords.map((record) => (
            <StyledRecordItem key={record.id}>
              <StyledRecordAccent $category={record.category} />
              <FlexColumn style={{ flex: 1, minWidth: 0 }}>
                <Paragraph $size="xsmall" $variant="tertiary" $allCaps>
                  {ACHIEVEMENT_CATEGORIES[record.category]}
                </Paragraph>
                <Paragraph
                  $size="small"
                  $weight={600}
                  $whiteSpace="nowrap"
                  $overflow="hidden"
                  $textOverflow="ellipsis"
                >
                  {record.title}
                </Paragraph>
              </FlexColumn>
              <FlexColumn $align="flex-end" $flexShrink={0}>
                <Paragraph $weight={700}>{formatAchievementValue(record)}</Paragraph>
                <Paragraph $size="xsmall" $variant="tertiary">
                  {formatDate(record.achieved_at, { preset: 'shortDate' })}
                </Paragraph>
              </FlexColumn>
            </StyledRecordItem>
          ))}
        </>
      ) : (
        <FlexColumn $align="center" $pt="2xl" $pb="2xl">
          <Paragraph $variant="secondary" $size="small" $mb="md">
            {t('Nog geen records')}
          </Paragraph>
          <button type="button" onClick={handleManage} style={{ all: 'unset', cursor: 'pointer' }}>
            <StyledCard $variant="pill" $interactive>
              <FlexRow $gap="xs" $align="center">
                <Icons.Plus size="sm" />
                <Paragraph $size="small" $weight={600}>
                  {t('Record toevoegen')}
                </Paragraph>
              </FlexRow>
            </StyledCard>
          </button>
        </FlexColumn>
      )}
    </StyledCard>
  );
}
