import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledDot = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 0.4em;
  height: 0.4em;
  border-radius: ${theme.borderRadius.full};
  background: currentColor;
  margin-right: ${theme.spacing.xs};
  vertical-align: middle;
`;
