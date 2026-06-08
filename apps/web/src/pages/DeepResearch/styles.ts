import styled, { css, keyframes } from 'styled-components';

import { theme } from '@package/ui';

const STATUS_COLORS = {
  optimal: { bg: theme.colors.accent.teal.soft, text: theme.colors.accent.teal.strong },
  good: { bg: theme.colors.accent.green.soft, text: theme.colors.accent.green.strong },
  attention: { bg: theme.colors.warning.soft, text: theme.colors.warning.strong },
  concern: { bg: theme.colors.error.soft, text: theme.colors.error.strong },
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

export const StyledRatiosRow = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  overflow-x: auto;
  padding-bottom: ${theme.spacing.xs};
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.neutral[300]};
    border-radius: 2px;
  }

  > * {
    min-width: 280px;
    flex-shrink: 0;
  }
`;
