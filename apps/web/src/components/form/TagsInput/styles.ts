import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledTagsWrapper = styled.div<{ $focused: boolean }>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${theme.spacing.xs};
  min-height: 42px;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border: 1px solid
    ${({ $focused }) => ($focused ? theme.colors.border.strong : theme.colors.border.subtle)};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.background.raised};
  cursor: text;
  transition: border-color ${theme.transitions.duration.fast} ease;
`;

export const StyledTagChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px ${theme.spacing.sm};
  background: ${theme.colors.neutral[200]};
  border: 1px solid ${theme.colors.border.subtle};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.primary};
  line-height: 1.4;
  white-space: nowrap;
`;

export const StyledTagRemove = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: ${theme.colors.text.muted};
  line-height: 1;
  font-size: 14px;

  &:hover {
    color: ${theme.colors.text.primary};
  }
`;

export const StyledTagInput = styled.input`
  flex: 1;
  min-width: 120px;
  border: none;
  outline: none;
  background: transparent;
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.primary};
  font-family: inherit;
  padding: 2px 0;

  &::placeholder {
    color: ${theme.colors.text.muted};
  }
`;

export const StyledTagHint = styled.p`
  margin: ${theme.spacing.xs} 0 0;
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.muted};
`;
