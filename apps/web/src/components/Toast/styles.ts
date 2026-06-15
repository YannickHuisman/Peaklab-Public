import type { ToastVariant } from '@context/ToastProvider';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const ToastViewport = styled.div`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  z-index: ${({ theme }) => theme.zIndex.tooltip};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  width: min(360px, calc(100vw - 32px));
  pointer-events: none;
`;

export const ToastItem = styled.div<{ $variant: ToastVariant }>`
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border-left: 3px solid
    ${({ theme, $variant }) =>
      $variant === 'error'
        ? theme.colors.error.strong
        : $variant === 'success'
          ? theme.colors.success.strong
          : theme.colors.text.primary};
  animation: ${slideIn} 200ms ease-out;
`;

export const ToastBody = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ToastClose = styled.button`
  appearance: none;
  border: none;
  background: transparent;
  padding: 0;
  margin: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text.muted};
`;
