import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledAvatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: ${theme.borderRadius.full};
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: ${theme.colors.background.raised};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: 600;
`;
