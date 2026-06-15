import type { Range } from '@components/RangeBar/RangeBar';

import { theme } from '@package/ui';

type SimpleRange = { min: number; max: number };

export function getRangeStatus(
  value: number,
  normalRange: Range | SimpleRange,
  performanceRange?: Range | SimpleRange
) {
  const isOutOfNormal = value < normalRange.min || value > normalRange.max;
  const isInPerformance =
    performanceRange && value >= performanceRange.min && value <= performanceRange.max;

  if (isOutOfNormal) {
    return { label: 'Out of range', tone: 'error' as const, color: theme.colors.error.strong };
  }

  if (isInPerformance) {
    return {
      label: 'Performance range',
      tone: 'success' as const,
      color: theme.colors.success.strong,
    };
  }

  return { label: 'Normal range', tone: 'info' as const, color: theme.colors.info.strong };
}
