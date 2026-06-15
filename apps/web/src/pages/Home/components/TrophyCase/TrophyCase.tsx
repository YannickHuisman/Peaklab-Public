import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@components/Button/Button';
import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { Label } from '@components/Primitives';
import { FlexColumn, FlexRow, Grid } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { useModal } from '@context/ModalProvider';
import { formatDate } from '@helpers/formatDate';
import { useTranslation } from '@helpers/i18n';
import { useDeviceBreakpoints } from '@hooks/useDeviceBreakpoints';

import type { Achievement } from '@package/api';
import { useData } from '@package/api';
import { theme } from '@package/ui';

import { ManageAchievements } from './ManageAchievements';
import { StyledTrophyScroller } from './styles';
import { ACHIEVEMENT_CATEGORIES } from './types';

function formatAchievementValue(a: Achievement) {
  if (a.category === 'kracht' && a.reps) {
    return `${a.value} kg ×${a.reps}`;
  }

  return a.value;
}

function getCategoryIcon(category: string) {
  if (category === 'kracht') return Icons.Dumbbell;

  return Icons.Activity;
}

function TrophyCard({
  record,
  isRecent,
  icon: CategoryIcon,
  width,
}: {
  record: Achievement;
  isRecent: boolean;
  icon: React.ComponentType<{ size: number; color: string }>;
  width?: number;
}) {
  return (
    <StyledCard $padding="lg" style={{ position: 'relative', overflow: 'hidden', width }}>
      <div
        style={{
          position: 'absolute',
          right: -18,
          bottom: -22,
          opacity: 0.045,
          pointerEvents: 'none',
        }}
      >
        <CategoryIcon size={132} color={theme.colors.ink} />
      </div>

      <FlexRow $justify="space-between" $align="center" $mb="md" $gap="sm">
        <FlexRow $gap="sm" $align="center">
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: theme.colors.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CategoryIcon size={17} color={theme.colors.ink} />
          </div>
          <Label color={theme.colors.ink}>{ACHIEVEMENT_CATEGORIES[record.category]}</Label>
        </FlexRow>
        {isRecent && (
          <StyledCard $variant="pill" $tone="success">
            <Paragraph $size="xsmall" $weight={700} $whiteSpace="nowrap">
              Meest recent
            </Paragraph>
          </StyledCard>
        )}
      </FlexRow>

      <Heading $size="xlarge" $weight={700} $color={theme.colors.ink}>
        {formatAchievementValue(record)}
      </Heading>

      <Paragraph $weight={600} $mt="sm" $mb="md">
        {record.title}
      </Paragraph>

      <FlexRow $gap="xs" $align="center">
        <Icons.Calendar size={13} color={theme.colors.ink40} />
        <Label color={theme.colors.ink40} style={{ letterSpacing: 0 }}>
          {formatDate(record.achieved_at, { preset: 'shortDate' })}
        </Label>
      </FlexRow>
    </StyledCard>
  );
}

export function TrophyCase() {
  const { t } = useTranslation();

  const { achievements, addAchievement, removeAchievement } = useData();
  const { openModal } = useModal();
  const { isMobile } = useDeviceBreakpoints();

  const sorted = useMemo(
    () =>
      [...achievements].sort(
        (a, b) => new Date(b.achieved_at).getTime() - new Date(a.achieved_at).getTime()
      ),
    [achievements]
  );

  const mostRecent = sorted[0] ?? null;

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    if (!isMobile || !scrollerRef.current) return;
    const scroller = scrollerRef.current;

    const equalize = () => {
      const items = Array.from(scroller.children) as HTMLElement[];

      items.forEach((el) => {
        el.style.width = '';
      });

      const max = Math.max(...items.map((el) => el.getBoundingClientRect().width));

      if (max > 0) {
        items.forEach((item) => {
          item.style.width = `${max}px`;
        });

        setCardWidth(max);
      }
    };

    equalize();

    scroller.scrollLeft = 0;

    // Re-equalize when the container's width changes — on initial page load the
    // parent layout may not be fully settled when this effect first runs.
    const parent = scroller.parentElement;

    if (!parent) return;

    let lastWidth = parent.getBoundingClientRect().width;

    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;

      if (w !== lastWidth) {
        lastWidth = w;
        equalize();
      }
    });

    ro.observe(parent);

    return () => ro.disconnect();
  }, [isMobile, sorted]);

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

  const addButton = (
    <button
      onClick={handleManage}
      style={{
        borderRadius: 18,
        background: 'rgba(12,23,34,.03)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        cursor: 'pointer',
        minHeight: 200,
        border: 'none',
        padding: 26,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 99,
          background: theme.colors.surface,
          boxShadow: theme.shadows.sm,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icons.Plus size={20} color={theme.colors.ink60} />
      </div>
      <Paragraph $size="small" $weight={600} $variant="secondary">
        Record toevoegen
      </Paragraph>
    </button>
  );

  return (
    <div>
      <FlexRow $justify="space-between" $align="flex-end" $mb="md">
        <FlexColumn $gap="xxs">
          <Heading $size="small" $weight={700}>
            {t('Trophy Case')}
          </Heading>
          <Paragraph $size="small" $variant="secondary">
            Je persoonlijke records en mijlpalen
          </Paragraph>
        </FlexColumn>
        <Button $variant="secondary" $size="small" onClick={handleManage}>
          <FlexRow $gap="xs" $align="center">
            <Icons.Edit size={16} color={theme.colors.ink60} />
            <span>{t('Records beheren')}</span>
          </FlexRow>
        </Button>
      </FlexRow>

      {isMobile ? (
        <StyledTrophyScroller ref={scrollerRef}>
          {sorted.map((record) => (
            <TrophyCard
              key={record.id}
              record={record}
              isRecent={mostRecent?.id === record.id}
              icon={getCategoryIcon(record.category)}
              width={cardWidth}
            />
          ))}
          {addButton}
        </StyledTrophyScroller>
      ) : (
        <Grid $gridColumns="repeat(3, 1fr)" $gap="lg">
          {sorted.map((record) => (
            <TrophyCard
              key={record.id}
              record={record}
              isRecent={mostRecent?.id === record.id}
              icon={getCategoryIcon(record.category)}
            />
          ))}
          {addButton}
        </Grid>
      )}
    </div>
  );
}
