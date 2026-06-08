import { useState } from 'react';

import { Button } from '@components/Button/Button';
import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { useTranslation } from '@helpers/i18n';

import { theme } from '@package/ui';

import type { PerformanceTipsData } from '../types';
import { TipRow } from './TipRow';
import { StyledGoalHeader, StyledGoalText } from './tipStyles';

interface TipSelectionViewProps {
  tipsData: PerformanceTipsData;
  selectedTipIds: Set<string>;
  onToggleTip: (id: string) => void;
  onSave: () => void;
  isSaving?: boolean;
}

export function TipSelectionView({
  tipsData,
  selectedTipIds,
  onToggleTip,
  onSave,
  isSaving,
}: TipSelectionViewProps) {
  const { t } = useTranslation();
  const goalEntries = Object.entries(tipsData?.tips_by_goal ?? {}).filter(
    ([key]) => key !== 'biomarkers'
  );
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(
    () => new Set(goalEntries.map(([key]) => key))
  );

  const toggleGoal = (key: string) => {
    setExpandedGoals((prev) => {
      const next = new Set(prev);

      if (next.has(key)) next.delete(key);
      else next.add(key);

      return next;
    });
  };

  const count = selectedTipIds.size;

  return (
    <FlexColumn $gap="lg">
      <FlexRow $align="flex-start" $justify="space-between" $gap="md" $flexWrap="wrap">
        <FlexColumn $gap="xs">
          <Heading $size="large">{t('Jouw Performance Tips')}</Heading>
          <Paragraph $variant="secondary">
            {t('Selecteer de tips die je wilt toepassen in je performance plan')}
          </Paragraph>
        </FlexColumn>
        <FlexRow $gap="sm" $align="center">
          <Button
            $variant="primary"
            $size="small"
            $borderRadius="full"
            onClick={onSave}
            disabled={count === 0 || isSaving}
          >
            <FlexRow $gap="xs" $align="center">
              <Icons.Check size="sm" />
              <span>{isSaving ? t('Opslaan...') : t('Tips Opslaan')}</span>
            </FlexRow>
          </Button>
          {count > 0 && (
            <Paragraph $size="small" $weight={600} $variant="secondary" $whiteSpace="nowrap">
              {count} {t('geselecteerd')}
            </Paragraph>
          )}
        </FlexRow>
      </FlexRow>

      {goalEntries.map(([key, { goal, tips }]) => {
        const isExpanded = expandedGoals.has(key);
        const selectedInGroup = tips.filter((t) => selectedTipIds.has(t.id)).length;

        return (
          <FlexColumn $gap="md" key={key}>
            <StyledGoalHeader type="button" onClick={() => toggleGoal(key)}>
              {/* {key === 'biomarkers' ? (
                <Icons.Activity size="sm" color={theme.colors.accent.teal.main} />
              ) : (
                <Icons.Target size="sm" color={theme.colors.primary} />
              )} */}
              <StyledGoalText title={goal}>{goal}</StyledGoalText>
              <FlexRow $gap="sm" $align="center" $flexShrink={0} $width="auto">
                {selectedInGroup > 0 && (
                  <span
                    style={{
                      fontSize: theme.typography.fontSize.xs,
                      fontWeight: 600,
                      color: theme.colors.text.muted,
                    }}
                  >
                    {selectedInGroup}/{tips.length}
                  </span>
                )}
                {isExpanded ? (
                  <Icons.ChevronUp size="sm" color={theme.colors.text.muted} />
                ) : (
                  <Icons.ChevronDown size="sm" color={theme.colors.text.muted} />
                )}
              </FlexRow>
            </StyledGoalHeader>

            {isExpanded && (
              <FlexColumn $gap="sm">
                {tips.map((tip, index) => (
                  <TipRow
                    key={tip.id}
                    tip={tip}
                    index={index}
                    selected={selectedTipIds.has(tip.id)}
                    onToggle={() => onToggleTip(tip.id)}
                    viewSourceLabel={t('Bekijk bron')}
                  />
                ))}
              </FlexColumn>
            )}
          </FlexColumn>
        );
      })}
    </FlexColumn>
  );
}
