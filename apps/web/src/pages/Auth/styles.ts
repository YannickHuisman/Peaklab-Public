import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledAuthContainer = styled.main`
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const StyledAuthLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    height: 40px;
  }
`;

export const StyledMessage = styled.div<{ $type: 'error' | 'success' }>`
  padding: ${theme.spacing.md};
  background: ${({ $type }) =>
    $type === 'error' ? theme.colors.error.soft : theme.colors.success.soft};
  color: ${({ $type }) =>
    $type === 'error' ? theme.colors.error.strong : theme.colors.success.strong};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  text-align: center;
`;

export const StyledGoogleIcon = styled.svg`
  width: 18px;
  height: 18px;
`;

export const StyledForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

export const StyledVideoBackground = styled.video`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
`;

export const StyledVideoOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(255, 255, 255, 0.2) 100%
  );
`;

export const StyledAuthWrapper = styled.div`
  height: 100dvh;
  position: relative;
  overflow: hidden;
  background-color: ${theme.colors.background.app};
  display: flex;
  align-items: center;
  justify-content: center;

  & > *:not(video):not(div:first-of-type) {
    position: relative;
    z-index: 2;
  }
`;
