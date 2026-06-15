import { NavLink } from 'react-router-dom';

import { EnforcedPageWidth } from '@components/styled/layout';
import styled from 'styled-components';

export const StyledNavbarContainer = styled.header<{ $heroMode?: boolean }>`
  position: sticky;
  top: 0;
  z-index: 20;
  width: 100%;
  flex-shrink: 0;
  /* Push content below the iOS status bar / notch (safe-area inset) */
  padding-top: env(safe-area-inset-top, 0px);
  background: rgba(247, 248, 250, 0.8);
  backdrop-filter: blur(14px);
  border-bottom: none;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 4px 14px rgba(15, 23, 42, 0.05);
  transition:
    background-color 0.35s ease,
    box-shadow 0.35s ease;
`;

export const StyledNavbarInner = styled(EnforcedPageWidth)<{ $isMobile?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  display: grid;
  grid-template-columns: ${({ $isMobile }) => ($isMobile ? '1fr 1fr' : '1fr auto 1fr')};
  align-items: center;
  column-gap: ${({ theme }) => theme.spacing.lg};
`;

// Use visibility instead of display so we can still measure the nav's width
// for the responsive detection logic
export const StyledDesktopNav = styled.nav<{ $hidden?: boolean }>`
  justify-self: center;
  display: ${({ $hidden }) => ($hidden ? 'none' : 'flex')};
  align-items: center;
`;

export const StyledLogo = styled.img`
  height: 40px;
  width: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.xs};
  transition: all 0.35s ease;
`;

// Keyboard-accessible home link wrapping the logo + wordmark.
export const StyledBrandButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
`;

export const StyledNavPills = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: transparent;
`;

export const StyledNavLink = styled(NavLink)`
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 99px;
  text-decoration: none;
  color: #8a929e;
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    color: #0c1722;
  }

  &.active {
    background-color: #ffffff;
    color: #0c1722;
    box-shadow:
      0 1px 2px rgba(15, 23, 42, 0.05),
      0 1px 1px rgba(15, 23, 42, 0.04);
  }
`;

export const StyledNextAppointmentChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 17px;
  border-radius: 99px;
  background-color: #ffffff;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.05),
    0 1px 1px rgba(15, 23, 42, 0.04);
  font-size: 13px;
  font-weight: 600;
  color: #5a6573;
  white-space: nowrap;
`;
