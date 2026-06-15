import { useMemo, useState } from 'react';

import { Button } from '@components/Button/Button';
import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { type TabItem, Tabs } from '@components/Tabs/Tabs';

import { theme } from '@package/ui';

import type { PerformanceTipsData } from '../types';
import { TipItem } from './TipItem';

interface PerformancePlanViewProps {
  tipsData: PerformanceTipsData;
  onEditTips?: () => void;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export function PerformancePlanView({
  tipsData,
  onEditTips,
  onRegenerate,
  isRegenerating,
}: PerformancePlanViewProps) {
  const goalEntries = useMemo(
    () => Object.entries(tipsData?.tips_by_goal ?? {}).filter(([key]) => key !== 'biomarkers'),
    [tipsData.tips_by_goal]
  );

  const selectedIds = useMemo(
    () => new Set(tipsData.selected_tip_ids ?? []),
    [tipsData.selected_tip_ids]
  );

  const [activeGoalKey, setActiveGoalKey] = useState<string>(goalEntries[0]?.[0] ?? '');

  const activeGoal = tipsData.tips_by_goal[activeGoalKey];
  const selectedTips = (activeGoal?.tips ?? []).filter((t) => selectedIds.has(t.id));

  const totalSelected = goalEntries.reduce(
    (acc, [, { tips }]) => acc + tips.filter((t) => selectedIds.has(t.id)).length,
    0
  );

  // Build Tabs items from goal keys
  const tabs: TabItem<string>[] = useMemo(
    () =>
      goalEntries.map(([key, { goal, tips }]) => {
        const count = tips.filter((t) => selectedIds.has(t.id)).length;
        const label = goal.length > 28 ? `${goal.slice(0, 28)}…` : goal;

        return {
          id: key,
          label: `${label}${count > 0 ? ` (${count})` : ''}`,
        };
      }),
    [goalEntries, selectedIds]
  );

  return (
    <FlexColumn $gap="lg">
      {/* Header */}
      <FlexRow
        $align="flex-start"
        $justify="space-between"
        $flexWrap="wrap"
        style={{ gap: theme.spacing.md }}
      >
        <FlexColumn $gap="xs">
          <Heading $size="medium">Performance Plan</Heading>
          <Paragraph $variant="secondary" $weight={400}>
            {totalSelected} geselecteerde {totalSelected === 1 ? 'tip' : 'tips'}
          </Paragraph>
        </FlexColumn>
        <FlexRow $gap="sm" style={{ flexWrap: 'wrap' }}>
          {onEditTips && (
            <Button
              $variant="secondary"
              $size="small"
              $borderRadius="full"
              onClick={onEditTips}
              disabled={isRegenerating}
            >
              <FlexRow $gap="xs" $align="center">
                <Icons.Edit size="xs" />
                <span>Tips aanpassen</span>
              </FlexRow>
            </Button>
          )}
          {onRegenerate && (
            <Button
              $variant="ghost"
              $size="small"
              $borderRadius="full"
              onClick={onRegenerate}
              disabled={isRegenerating}
            >
              <FlexRow $gap="xs" $align="center">
                <Icons.RefreshCw size="xs" />
                <span>{isRegenerating ? 'Bezig...' : 'Nieuwe tips genereren'}</span>
              </FlexRow>
            </Button>
          )}
        </FlexRow>
      </FlexRow>

      {/* Goal tabs (only show when multiple goals) */}
      {goalEntries.length > 1 && (
        <Tabs tabs={tabs} activeTab={activeGoalKey} onChange={setActiveGoalKey} />
      )}

      {/* Selected tips list */}
      {selectedTips.length > 0 && (
        <FlexColumn $gap="sm">
          {selectedTips.map((tip, i) => (
            <TipItem key={tip.id} tip={tip} index={i} />
          ))}
        </FlexColumn>
      )}
      {selectedTips.length === 0 && (
        <FlexColumn $align="center" $justify="center" $padding="3xl">
          <Paragraph $variant="secondary">Geen tips geselecteerd voor dit doel.</Paragraph>
          {onEditTips && (
            <Button
              $variant="ghost"
              $size="small"
              onClick={onEditTips}
              style={{ marginTop: theme.spacing.sm }}
            >
              Tips selecteren
            </Button>
          )}
        </FlexColumn>
      )}
    </FlexColumn>
  );
}
