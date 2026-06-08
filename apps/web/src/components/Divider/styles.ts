import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledDivider = styled.div<{ $hasChildren?: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  color: ${theme.colors.text.muted};
  font-size: ${theme.typography.fontSize.sm};

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${theme.colors.border.subtle};
  }

  &::before {
    margin-right: ${({ $hasChildren }) => ($hasChildren ? theme.spacing.md : '0')};
  }

  &::after {
    margin-left: ${({ $hasChildren }) => ($hasChildren ? theme.spacing.md : '0')};
  }
`;
