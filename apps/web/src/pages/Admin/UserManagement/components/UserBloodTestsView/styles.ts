import { FlexColumn } from '@components/styled/layout';
import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledContainer = styled(FlexColumn)`
  gap: ${theme.spacing.md};
`;

export const StyledEmptyState = styled.div`
  padding: ${theme.spacing['2xl']};
  text-align: center;
  color: ${theme.colors.text.secondary};
`;

export const StyledTestStatus = styled.div<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xxs};
  padding: ${theme.spacing.xxs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: 500;
  background: ${(props) =>
    props.$status === 'completed' ? theme.colors.success.soft : theme.colors.warning.soft};
  color: ${(props) =>
    props.$status === 'completed' ? theme.colors.success.strong : theme.colors.warning.strong};
`;
