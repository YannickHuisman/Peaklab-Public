import { FlexRow } from '@components/styled/layout';
import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledSelect = styled.select`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.border.strong};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.primary};
  background: ${theme.colors.background.raised};

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

export const StyledInput = styled.input`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.border.strong};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.primary};
  background: ${theme.colors.background.raised};
  width: 100%;
  box-sizing: border-box;

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

export const StyledListHeader = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: 600;
  color: ${theme.colors.text.secondary};
  padding-bottom: ${theme.spacing.xs};
  border-bottom: 1px solid ${theme.colors.border.subtle};
`;

export const StyledEmptyState = styled.div`
  padding: ${theme.spacing['2xl']};
  text-align: center;
  color: ${theme.colors.text.secondary};
`;

export const StyledTestCardHeader = styled(FlexRow)`
  justify-content: space-between;
  align-items: flex-start;
`;

export const StyledTestStatus = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xxs};
  padding: ${theme.spacing.xxs} ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: 500;
  background: ${(props) =>
    props.$status === 'completed' ? theme.colors.success.soft : theme.colors.warning.soft};
  color: ${(props) =>
    props.$status === 'completed' ? theme.colors.success.strong : theme.colors.warning.strong};
  width: fit-content;
`;
