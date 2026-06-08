import styled from 'styled-components';

import type { AchievementCategory } from '@package/api';
import { theme } from '@package/ui';

const CATEGORY_COLORS: Record<AchievementCategory, { accent: string }> = {
  algemeen: { accent: theme.colors.text.muted },
  kracht: { accent: theme.colors.accent.blue.main },
  hardlopen: { accent: theme.colors.accent.green.main },
};

export const StyledHeaderLink = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.text.muted};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  transition: color ${theme.transitions.duration.fast} ease;

  &:hover {
    color: ${theme.colors.text.primary};
  }
`;

export const StyledRecordItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md} 0;
  border-bottom: 1px solid ${theme.colors.border.subtle};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

export const StyledRecordAccent = styled.div<{ $category: AchievementCategory }>`
  width: 3px;
  height: 24px;
  border-radius: 2px;
  background: ${({ $category }) => CATEGORY_COLORS[$category].accent};
  flex-shrink: 0;
`;

export const StyledDeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme.colors.text.muted};
  padding: ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    color ${theme.transitions.duration.fast} ease,
    background ${theme.transitions.duration.fast} ease;

  &:hover {
    color: ${theme.colors.error.strong};
    background: ${theme.colors.error.soft};
  }
`;
