import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledSectionTitle = styled.h3`
  font-size: ${theme.typography.fontSize.base};
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.md};
  padding-bottom: ${theme.spacing.xs};
  border-bottom: 1px solid ${theme.colors.border.subtle};
`;

export const StyledLabel = styled.label`
  display: block;
  font-size: ${theme.typography.fontSize.sm};
  font-weight: 500;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xs};
`;
