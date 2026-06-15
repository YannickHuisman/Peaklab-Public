import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledToggleGroupWrapper = styled.div`
  display: flex;
  border: 1px solid ${theme.colors.border.strong};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
  width: fit-content;
  gap: 2px;
`;

export const StyledToggleGroupButton = styled.button<{ $active: boolean }>`
  padding: ${theme.spacing.xxs} ${theme.spacing.sm};
  border: none;
  border-radius: ${theme.borderRadius.full};
  background: ${(props) => (props.$active ? theme.colors.accent.blue.main : 'transparent')};
  color: ${(props) => (props.$active ? '#fff' : theme.colors.text.secondary)};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: 500;
  cursor: pointer;
  transition: all ${theme.transitions.duration.normal};
  white-space: nowrap;

  &:hover {
    background: ${(props) =>
      props.$active ? theme.colors.accent.blue.main : theme.colors.background.subtle};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
