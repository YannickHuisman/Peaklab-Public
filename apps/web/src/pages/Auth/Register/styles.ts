import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledPanelOption = styled.button<{ $selected: boolean }>`
  width: 100%;
  text-align: left;
  padding: ${theme.spacing.md};
  border: 2px solid
    ${(props) => (props.$selected ? theme.colors.accent.blue.main : theme.colors.border.subtle)};
  border-radius: ${theme.borderRadius.md};
  background: ${(props) =>
    props.$selected ? theme.colors.info.soft : theme.colors.background.raised};
  cursor: pointer;
  transition: all ${theme.transitions.duration.normal};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xxs};

  &:hover {
    border-color: ${theme.colors.accent.blue.main};
    background: ${theme.colors.info.soft};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const StyledPanelList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  max-height: 50vh;
  overflow-y: auto;
  padding-right: ${theme.spacing.xs};
`;
