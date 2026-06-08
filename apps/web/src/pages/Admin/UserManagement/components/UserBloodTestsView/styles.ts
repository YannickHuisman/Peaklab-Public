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
  background: ${theme.colors.background.default};
  border-radius: ${theme.borderRadius.md};
  border: 1px dashed ${theme.colors.border.strong};
`;

export const StyledTestCard = styled.div<{ $clickable: boolean }>`
  padding: ${theme.spacing.md};
  background: ${theme.colors.background.raised};
  border: 1px solid ${theme.colors.border.subtle};
  border-radius: ${theme.borderRadius.md};
  cursor: ${(props) => (props.$clickable ? 'pointer' : 'default')};
  transition: all ${theme.transitions.duration.normal};

  &:hover {
    ${(props) =>
      props.$clickable &&
      `border-color: ${theme.colors.accent.blue.main}; box-shadow: ${theme.shadows.sm};`}
  }
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
