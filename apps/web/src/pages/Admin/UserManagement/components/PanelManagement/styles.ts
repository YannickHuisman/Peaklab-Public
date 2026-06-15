import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledSelect = styled.select`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.border.strong};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.primary};
  background: ${theme.colors.background.raised};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent.blue.main};
    box-shadow: 0 0 0 3px ${theme.colors.accent.blue.soft};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const StyledPanelCard = styled.div<{ $selected: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 2px solid
    ${(props) => (props.$selected ? theme.colors.accent.blue.main : theme.colors.border.subtle)};
  border-radius: ${theme.borderRadius.md};
  background: ${(props) =>
    props.$selected ? theme.colors.info.soft : theme.colors.background.raised};
  cursor: pointer;
  transition: all ${theme.transitions.duration.normal};

  &:hover {
    border-color: ${theme.colors.accent.blue.main};
    background: ${theme.colors.info.soft};
  }
`;
