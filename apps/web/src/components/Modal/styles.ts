import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${theme.zIndex.modal};
  padding: ${theme.spacing.lg};
  animation: fadeIn ${theme.transitions.duration.fast} ease;

  @media (max-width: ${theme.breakpoints.sm}px) {
    padding: ${theme.spacing.sm};
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const StyledModalContent = styled.div<{ $maxWidth: string }>`
  position: relative;
  background: ${theme.colors.background.default};
  border-radius: ${theme.borderRadius.lg};
  max-width: ${({ $maxWidth }) => $maxWidth};
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: ${theme.shadows.xl};
  animation: slideUp ${theme.transitions.duration.normal} ease;

  @media (max-width: ${theme.breakpoints.sm}px) {
    max-height: 95vh;
    margin: ${theme.spacing.sm};
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const StyledModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.xl} ${theme.spacing.xl} ${theme.spacing.md};
  flex-shrink: 0;
`;

export const StyledModalCloseButton = styled.div`
  position: absolute;
  top: ${theme.spacing.xl};
  right: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.sm}px) {
    top: ${theme.spacing.md};
    right: ${theme.spacing.md};
  }
`;

export const StyledModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: ${theme.spacing.lg} ${theme.spacing.xl} ${theme.spacing.xl};
  -webkit-overflow-scrolling: touch;

  @media (max-width: ${theme.breakpoints.sm}px) {
    padding: ${theme.spacing.md};
  }
`;
