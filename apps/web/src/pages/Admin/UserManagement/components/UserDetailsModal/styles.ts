import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledTabContent = styled.div`
  flex: 1;
  padding: ${theme.spacing.xxs};
  min-height: 0;
`;

export const StyledNoDataMessage = styled.div`
  padding: ${theme.spacing.xl};
  text-align: center;
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.sm};
`;

export const StyledSummaryCard = styled.div`
  padding: ${theme.spacing.md};
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: ${theme.borderRadius.lg};
  color: ${theme.colors.background.raised};
  text-align: center;
`;
