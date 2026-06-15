import styled from 'styled-components';

/* Skip link: visually hidden until focused, lets keyboard/screen-reader users
   jump straight to the main content past the navigation (WCAG 2.4.1). */
export const StyledSkipLink = styled.a`
  position: absolute;
  left: ${({ theme }) => theme.spacing.md};
  top: -100px;
  z-index: ${({ theme }) => theme.zIndex.modal + 1};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.raised};
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  font-weight: 600;
  text-decoration: none;
  transition: top ${({ theme }) => theme.transitions.duration.fast} ease;

  &:focus {
    top: ${({ theme }) => theme.spacing.md};
  }
`;

export const StyledMainContent = styled.main<{ $showNavbar?: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: ${({ theme, $showNavbar }) =>
    $showNavbar ? theme.spacing.xl : `calc(${theme.spacing.xl} + env(safe-area-inset-top, 0px))`};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.md - 1}px) {
    margin-top: ${({ theme, $showNavbar }) =>
      $showNavbar ? theme.spacing.lg : `calc(${theme.spacing.lg} + env(safe-area-inset-top, 0px))`};
  }
`;
