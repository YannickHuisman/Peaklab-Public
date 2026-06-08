import { NavLink } from 'react-router-dom';

import { EnforcedPageWidth } from '@components/styled/layout';
import styled from 'styled-components';

// Notification bell
export const StyledNotificationWrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

export const StyledNotificationBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background: ${({ theme }) => theme.colors.error.strong};
  color: #fff;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledNotificationDropdown = styled.div`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing.sm});
  right: 0;
  background: ${({ theme }) => theme.colors.background.raised};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  min-width: 320px;
  max-width: 380px;
  max-height: 400px;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.sm};
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  animation: slideDown ${({ theme }) => theme.transitions.duration.fast} ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-${({ theme }) => theme.spacing.sm});
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const StyledNotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const StyledNotificationItem = styled.div<{ $unread?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.duration.fast} ease;
  background-color: transparent;
  border-left: 3px solid transparent;

  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[200]};
  }
`;

export const StyledNotificationDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent.hero.main};
  flex-shrink: 0;
  margin-top: 6px;
`;

export const StyledNavbarContainer = styled.header<{ $heroMode?: boolean }>`
  position: sticky;
  top: 0;
  z-index: 20;
  width: 100%;
  background-color: ${({ $heroMode, theme }) =>
    $heroMode ? theme.colors.accent.hero.main : theme.colors.navbar.bg};
  border-bottom: ${({ $heroMode, theme }) =>
    $heroMode ? '1px solid transparent' : `1px solid ${theme.colors.neutral[200]}`};
  transition:
    background-color 0.35s ease,
    border-bottom-color 0.35s ease;
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

export const StyledLogo = styled.img<{ $heroMode?: boolean }>`
  height: 40px;
  width: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.xs};
  ${({ $heroMode }) => $heroMode && `filter: invert(1);`}
  transition: filter 0.35s ease;
`;

export const StyledNavPills = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.neutral[200]};
`;

export const StyledNavLink = styled(NavLink)`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: 500;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text.muted};
  transition: all ${({ theme }) => theme.transitions.duration.normal} ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.background.raised};
    color: ${({ theme }) => theme.colors.text.primary};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

export const StyledLogoutButton = styled.button`
  padding: 0.45rem 0.9rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: none;
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: 500;
  background-color: ${({ theme }) => theme.colors.error.soft};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// Mobile Navbar Styles
export const StyledMobileNavbarContainer = styled.nav<{ $heroMode?: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  padding-bottom: calc(${({ theme }) => theme.spacing.sm} + env(safe-area-inset-bottom, 0px));
  background-color: ${({ $heroMode, theme }) =>
    $heroMode ? theme.colors.accent.hero.soft : theme.colors.navbar.bg};
  border-top: ${({ $heroMode, theme }) =>
    $heroMode ? '1px solid transparent' : `1px solid ${theme.colors.neutral[200]}`};
  box-shadow: ${({ $heroMode, theme }) => ($heroMode ? 'none' : theme.shadows.md)};
  height: 55px;
  transition:
    background-color 0.35s ease,
    border-top-color 0.35s ease,
    box-shadow 0.35s ease;
`;

export const StyledMobileNavItem = styled(NavLink)<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: ${({ theme }) => theme.transitions.duration.normal} ease;
  // min-width: 60px;

  &:active {
    transform: scale(0.95);
  }
`;

export const StyledMobileNavLabel = styled.span<{ $active?: boolean; $heroMode?: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  color: ${({ $active, $heroMode, theme }) => {
    if ($active) {
      return $heroMode ? theme.colors.primary : theme.colors.accent.hero.main;
    }

    return $heroMode ? theme.colors.whiteAlpha.visible : theme.colors.text.muted;
  }};
  white-space: nowrap;
  transition: color 0.35s ease;
`;

// Spacer to prevent content from being hidden behind the fixed mobile navbar
// Place this at the bottom of your page content when mobile navbar is visible
export const StyledMobileNavbarSpacer = styled.div`
  height: calc(55px + 1rem);
  flex-shrink: 0;
`;
