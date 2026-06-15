import styled, { css } from 'styled-components';

import { theme } from '@package/ui';

import type { TipCategory } from '../types';

export const StyledTipRow = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.md};
  width: 100%;
  padding: ${theme.spacing.lg};
  border: 1.5px solid
    ${({ $selected }) => ($selected ? theme.colors.primary : theme.colors.border.subtle)};
  border-radius: ${theme.borderRadius.lg};
  background: ${({ $selected }) =>
    $selected ? theme.colors.primarySoft : theme.colors.background.raised};
  cursor: pointer;
  text-align: left;
  transition: all ${theme.transitions.duration.fast} ease;

  &:hover {
    border-color: ${({ $selected }) =>
      $selected ? theme.colors.primary : theme.colors.border.strong};
    background: ${({ $selected }) =>
      $selected ? theme.colors.primarySoft : theme.colors.neutral[100]};
  }
`;

export const StyledCheckCircle = styled.div<{ $selected: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: ${theme.borderRadius.full};
  border: 2px solid
    ${({ $selected }) => ($selected ? theme.colors.primary : theme.colors.border.strong)};
  background: ${({ $selected }) => ($selected ? theme.colors.primary : 'transparent')};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
  transition: all ${theme.transitions.duration.fast} ease;
`;

export const StyledGoalHeader = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  width: 100%;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border: none;
  background: ${theme.colors.neutral[100]};
  border-radius: ${theme.borderRadius.lg};
  cursor: pointer;
  text-align: left;
  transition: background ${theme.transitions.duration.fast} ease;

  &:hover {
    background: ${theme.colors.neutral[200]};
  }
`;

export const StyledGoalText = styled.span`
  flex: 1;
  min-width: 0;
  font-size: ${theme.typography.fontSize.base};
  font-weight: 700;
  color: ${theme.colors.text.primary};
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CATEGORY_COLORS: Record<TipCategory, { bg: string; text: string }> = {
  training: { bg: theme.colors.accent.blue.soft, text: theme.colors.accent.blue.main },
  voeding: { bg: theme.colors.success.soft, text: theme.colors.success.strong },
  supplementen: { bg: theme.colors.warning.soft, text: theme.colors.warning.strong },
  lifestyle: { bg: theme.colors.primarySoft, text: theme.colors.neutral[700] },
  herstel: { bg: theme.colors.info.soft, text: theme.colors.info.strong },
};

export const StyledCategoryBadge = styled.span<{ $category: TipCategory }>`
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  padding: 2px ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: 600;
  letter-spacing: 0.02em;
  flex-shrink: 0;
  ${({ $category }) => {
    const colors = CATEGORY_COLORS[$category] ?? {
      bg: theme.colors.accent.orange.soft,
      text: theme.colors.accent.orange.main,
    };

    return css`
      background: ${colors.bg};
      color: ${colors.text};
    `;
  }}
`;

export const StyledTipNumber = styled.span`
  width: 28px;
  height: 28px;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.colors.neutral[100]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.typography.fontSize.xs};
  font-weight: 700;
  color: ${theme.colors.text.muted};
  flex-shrink: 0;
`;

export const StyledSourceLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.muted};
  text-decoration: none;
  margin-top: ${theme.spacing.xs};

  &:hover {
    color: ${theme.colors.text.secondary};
    text-decoration: underline;
  }
`;
