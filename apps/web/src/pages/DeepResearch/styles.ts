import styled, { css, keyframes } from 'styled-components';

import { theme } from '@package/ui';

const STATUS_COLORS = {
  optimal: { bg: theme.colors.tintPerf, text: theme.colors.performance },
  good: { bg: theme.colors.tintNormaal, text: theme.colors.normaal },
  attention: { bg: theme.colors.tintLet, text: theme.colors.letop },
  concern: { bg: theme.colors.tintBuiten, text: theme.colors.buiten },
} as const;

const PRIORITY_COLORS = {
  high: { bg: theme.colors.error.soft, text: theme.colors.error.strong },
  medium: { bg: theme.colors.warning.soft, text: theme.colors.warning.strong },
  low: { bg: theme.colors.accent.blue.soft, text: theme.colors.accent.blue.strong },
} as const;

export const StyledScoreCircle = styled.div<{ $score: number }>`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  background: ${({ $score }) => {
    const pct = Math.min(100, Math.max(0, $score));

    return `conic-gradient(
      ${theme.colors.primary} 0deg ${pct * 3.6}deg,
      rgba(255, 255, 255, 0.12) ${pct * 3.6}deg 360deg
    )`;
  }};

  &::after {
    content: '';
    position: absolute;
    inset: 8px;
    border-radius: 50%;
    background: ${theme.colors.accent.hero.main};
  }
`;

export const StyledScoreValue = styled.div`
  position: relative;
  z-index: 1;
  font-size: ${theme.typography.fontSize['4xl']};
  font-weight: 700;
  color: ${theme.colors.text.inverse};
  line-height: 1;
`;

export const StyledScoreLabel = styled.div`
  position: relative;
  z-index: 1;
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.whiteAlpha.visible};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: ${theme.spacing.xxs};
`;

export const StyledStatusBadge = styled.span<{
  $status: 'optimal' | 'good' | 'attention' | 'concern';
}>`
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  padding: 0.15rem 0.65rem;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: 600;
  white-space: nowrap;

  ${({ $status }) => {
    const c = STATUS_COLORS[$status];

    return css`
      background-color: ${c.bg};
      color: ${c.text};
    `;
  }}
`;

export const StyledPriorityBadge = styled.span<{
  $priority: 'high' | 'medium' | 'low';
}>`
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.65rem;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: 600;
  white-space: nowrap;

  ${({ $priority }) => {
    const c = PRIORITY_COLORS[$priority];

    return css`
      background-color: ${c.bg};
      color: ${c.text};
    `;
  }}
`;

export const StyledCategoryBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.65rem;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: 500;
  background-color: ${theme.colors.neutral[200]};
  color: ${theme.colors.text.secondary};
  white-space: nowrap;
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const StyledGeneratingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.lg};
  padding: ${theme.spacing['3xl']} ${theme.spacing.xl};
  text-align: center;
`;

export const StyledGeneratingRing = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid ${theme.colors.neutral[300]};
  border-top-color: ${theme.colors.primary};
  animation: ${rotate} 1.2s linear infinite;
`;

export const StyledHeroMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.whiteAlpha.visible};
`;

export const StyledInsightItem = styled.li`
  position: relative;
  padding-left: ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  line-height: ${theme.typography.lineHeight.relaxed};

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.55em;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${theme.colors.primary};
  }
`;

export const StyledDomainScore = styled.div<{
  $status: 'optimal' | 'good' | 'attention' | 'concern';
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.lg};
  font-weight: 700;
  flex-shrink: 0;

  ${({ $status }) => {
    const c = STATUS_COLORS[$status];

    return css`
      background-color: ${c.bg};
      color: ${c.text};
    `;
  }}
`;

export const StyledPerformanceList = styled.ul<{ $variant: 'strength' | 'improvement' }>`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};

  li {
    position: relative;
    padding-left: ${theme.spacing.lg};
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.secondary};
    line-height: ${theme.typography.lineHeight.relaxed};

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0.5em;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: ${({ $variant }) =>
        $variant === 'strength' ? theme.colors.accent.green.main : theme.colors.warning.main};
    }
  }
`;

export const StyledHeroContainer = styled.div`
  padding: 32px;
  background: linear-gradient(155deg, #15273a, #0b1620);
  border-radius: 18px;
  box-shadow:
    0 2px 6px rgba(15, 23, 42, 0.05),
    0 14px 36px rgba(15, 23, 42, 0.09);

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

export const StyledHeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
`;

export const StyledBucketTrack = styled.div`
  display: flex;
  width: 100%;
  height: 6px;
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
  gap: 2px;
`;

export const StyledBucketSegment = styled.div<{ $color: string; $active: boolean }>`
  flex: 1;
  border-radius: ${theme.borderRadius.full};
  ${({ $color, $active }) => css`
    background: ${$active ? $color : theme.colors.border.subtle};
    opacity: ${$active ? 1 : 0.6};
  `}
`;

export const StyledBucketLabel = styled.span<{ $active: boolean; $color: string }>`
  flex: 1;
  font-size: ${theme.typography.fontSize.xs};
  text-align: center;
  ${({ $active, $color }) => css`
    color: ${$active ? $color : theme.colors.text.muted};
    font-weight: ${$active ? 600 : 400};
  `}
`;

export const StyledStatusItem = styled.div<{ $hasDivider: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.xxs};
  ${({ $hasDivider }) =>
    $hasDivider &&
    css`
      border-right: 1px solid ${theme.colors.whiteAlpha.subtle};
    `}
`;

export const StyledStatusBar = styled.div`
  display: flex;
  width: 100%;
  height: 8px;
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
  background: ${theme.colors.whiteAlpha.subtle};
`;

export const StyledStatusSegment = styled.div<{ $color: string; $widthPct: number }>`
  height: 100%;
  ${({ $color, $widthPct }) => css`
    width: ${$widthPct}%;
    background: ${$color};
  `}
`;
