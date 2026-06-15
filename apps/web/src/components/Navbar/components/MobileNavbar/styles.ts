import { NavLink } from 'react-router-dom';

import styled from 'styled-components';

// iOS-style glassy floating capsule (theme-aware)
const NAV_PADDING_X = 10;

export const StyledMobileNavbarContainer = styled.nav<{ $heroMode?: boolean }>`
  position: fixed;
  bottom: calc(${({ theme }) => theme.spacing.md} + env(safe-area-inset-bottom, 0px));
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(360px, calc(100% - 64px));
  height: 64px;
  padding: 0 ${NAV_PADDING_X}px;
  border-radius: 999px;
  -webkit-tap-highlight-color: transparent;

  /* Light glassy iOS material (default) */
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.72) 0%, rgba(244, 246, 248, 0.78) 100%);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  box-shadow:
    0 10px 34px rgba(15, 23, 42, 0.16),
    inset 0 0.5px 0 rgba(255, 255, 255, 0.7),
    inset 0 0 0 0.5px rgba(15, 23, 42, 0.06);

  [data-theme='dark'] & {
    background: linear-gradient(180deg, rgba(38, 40, 46, 0.68) 0%, rgba(20, 22, 26, 0.74) 100%);
    box-shadow:
      0 10px 34px rgba(0, 0, 0, 0.32),
      inset 0 0.5px 0 rgba(255, 255, 255, 0.18),
      inset 0 0 0 0.5px rgba(255, 255, 255, 0.06);
  }
`;

// Sliding glassy highlight that animates behind the active icon
export const StyledMobileNavIndicator = styled.span<{ $index: number; $count: number }>`
  position: absolute;
  top: 50%;
  left: ${NAV_PADDING_X}px;
  width: calc((100% - ${NAV_PADDING_X * 2}px) / ${({ $count }) => $count});
  height: 48px;
  border-radius: 999px;
  pointer-events: none;
  opacity: ${({ $index }) => ($index < 0 ? 0 : 1)};
  transform: translateY(-50%) translateX(${({ $index }) => `${Math.max($index, 0) * 100}%`});
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.2s ease;

  /* Light: subtle dark-tinted pill; Dark: frosted white pill */
  background: rgba(15, 23, 42, 0.07);
  box-shadow: inset 0 0.5px 0 rgba(255, 255, 255, 0.5);

  [data-theme='dark'] & {
    background: rgba(255, 255, 255, 0.16);
    box-shadow: inset 0 0.5px 0 rgba(255, 255, 255, 0.22);
  }
`;

export const StyledMobileNavItem = styled(NavLink)<{ $active?: boolean }>`
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  transition:
    transform ${({ theme }) => theme.transitions.duration.fast} ease,
    color 0.15s ease;

  /* Pin color across :hover/:visited so the global anchor styles can't win */
  &,
  &:hover,
  &:visited {
    color: ${({ $active }) => ($active ? 'var(--color-text-primary)' : 'var(--color-text-muted)')};
  }

  &:active {
    transform: scale(0.86);
  }
`;

// Spacer to prevent content from being hidden behind the floating mobile navbar.
// Place this at the bottom of page content when the mobile navbar is visible.
export const StyledMobileNavbarSpacer = styled.div`
  height: calc(
    ${({ theme }) => theme.spacing['3xl']} + ${({ theme }) => theme.spacing.lg} +
      env(safe-area-inset-bottom, 0px)
  );
  flex-shrink: 0;
`;
