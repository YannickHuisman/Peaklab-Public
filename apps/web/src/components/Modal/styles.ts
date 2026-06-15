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

  /* Centered floating card on mobile, with breathing room all around */
  @media (max-width: ${theme.breakpoints.sm}px) {
    align-items: center;
    padding: ${theme.spacing.md};
    padding-top: calc(${theme.spacing.md} + env(safe-area-inset-top, 0px));
    padding-bottom: calc(${theme.spacing.md} + env(safe-area-inset-bottom, 0px));
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
  animation: slideUp ${theme.transitions.duration.normal} cubic-bezier(0.22, 1, 0.36, 1);

  /* Floating card on mobile — rounded all corners, doesn't fill the screen */
  @media (max-width: ${theme.breakpoints.sm}px) {
    max-width: 100%;
    max-height: 82dvh;
    border-radius: ${theme.borderRadius.xl};
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(24px);
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

  @media (max-width: ${theme.breakpoints.sm}px) {
    padding: ${theme.spacing.lg} ${theme.spacing.lg} ${theme.spacing.sm};
  }
`;

export const StyledModalCloseButton = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: ${theme.spacing.md} ${theme.spacing.md} 0;
  flex-shrink: 0;

  @media (max-width: ${theme.breakpoints.sm}px) {
    padding: ${theme.spacing.sm} ${theme.spacing.sm} 0;
  }
`;

export const StyledModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  /* Keeps a bottom gutter so footerless modals breathe. A sticky footer pulls
     itself into this gutter with a negative bottom offset (see footer) so it
     still sits flush to the card edge. */
  padding: ${theme.spacing.lg} ${theme.spacing.xl} ${theme.spacing.md};
  -webkit-overflow-scrolling: touch;

  @media (max-width: ${theme.breakpoints.sm}px) {
    padding: ${theme.spacing.md} ${theme.spacing.md} 0;
  }
`;

// Sticky footer — position: sticky inside overflow-y: auto pins it to the
// bottom of the visible modal while content scrolls above it. Negative side
// margins let it span the body's horizontal padding edge-to-edge so the soft
// separator shadow reads cleanly.
export const StyledModalFooter = styled.div`
  position: sticky;
  /* Negative offset pulls the footer down into the body's bottom padding gutter
     so it pins flush to the card edge (sticky bottom:0 alone would leave that
     padding as a visible gap below the footer). */
  bottom: -${theme.spacing.md};
  z-index: 1;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${theme.spacing.sm};
  /* Negative side margins span the body's horizontal padding so the footer's
     background and separator shadow reach edge-to-edge. */
  margin: ${theme.spacing.lg} -${theme.spacing.xl} 0;
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  background: ${theme.colors.background.default};
  box-shadow: 0 -12px 16px -12px rgba(15, 23, 42, 0.12);

  & > button {
    min-height: 44px;
  }

  /* Balanced full-width buttons on mobile. Body has no bottom gutter on mobile,
     so the footer pins at bottom:0. */
  @media (max-width: ${theme.breakpoints.sm}px) {
    bottom: 0;
    margin: ${theme.spacing.md} -${theme.spacing.md} 0;
    padding: ${theme.spacing.md};

    & > button {
      flex: 1;
    }
  }
`;
