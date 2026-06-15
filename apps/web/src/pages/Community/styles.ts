import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledIconRing = styled.div`
  width: 76px;
  height: 76px;
  border-radius: 22px;
  background: ${theme.colors.surface};
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 4px 14px rgba(15, 23, 42, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 17px;
  border-radius: 99px;
  background: ${theme.colors.surface};
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 4px 14px rgba(15, 23, 42, 0.05);
`;

export const StyledEmailInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  border: 1.5px solid ${theme.colors.border.subtle};
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize.base};
  background: ${theme.colors.background.raised};
  color: ${theme.colors.text.primary};
  outline: none;
  transition: border-color ${theme.transitions.duration.fast} ease;

  &:focus {
    border-color: ${theme.colors.primary};
  }

  &::placeholder {
    color: ${theme.colors.text.muted};
  }
`;

export const StyledSuccessBanner = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.success.soft};
  color: ${theme.colors.success.strong};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: 500;
`;
