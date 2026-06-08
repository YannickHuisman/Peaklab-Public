import styled from 'styled-components';

import { theme } from '@package/ui';

// const fadeUp = keyframes`
//   from { opacity: 0; transform: translateY(12px); }
//   to   { opacity: 1; transform: translateY(0); }
// `;

// const pulse = keyframes`
//   0%, 100% { opacity: 0.6; transform: scale(1); }
//   50%       { opacity: 1;   transform: scale(1.08); }
// `;

// export const StyledPage = styled.div`
//   min-height: calc(100vh - 120px);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   padding: ${theme.spacing.xl} ${theme.spacing.md};
//   animation: ${fadeUp} 0.4s ease both;
// `;

export const StyledIconRing = styled.div`
  width: 80px;
  height: 80px;
  border-radius: ${theme.borderRadius.full};
  background: linear-gradient(
    135deg,
    ${theme.colors.primary} 0%,
    ${theme.colors.primaryMuted} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 0 0 12px ${theme.colors.primarySoft},
    ${theme.shadows.lg};
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
