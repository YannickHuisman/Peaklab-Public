import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledGateWrapper = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  background: ${theme.colors.background.app};
  box-sizing: border-box;
`;

export const StyledPlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${theme.spacing.md};
  width: 100%;
  max-width: 960px;
`;

export const StyledSignOutButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme.colors.text.secondary};
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize.sm};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};

  &:hover {
    color: ${theme.colors.text.primary};
  }
`;
