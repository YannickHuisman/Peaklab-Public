import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledTabsWrapper = styled.div`
  position: relative;
  width: 100%;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${theme.colors.border.subtle};
  }
`;

export const StyledTabsRow = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  gap: ${theme.spacing.lg};
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  flex-wrap: nowrap;
  position: relative;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: ${theme.breakpoints.md}px) {
    flex-wrap: wrap;
    overflow-x: visible;
  }

  ${({ $fullWidth }) =>
    $fullWidth &&
    `
    justify-content: space-between;
    gap: 0;
  `}
`;

export const StyledTab = styled.button<{ $active: boolean; $fullWidth?: boolean }>`
  cursor: pointer;
  position: relative;
  padding-bottom: ${theme.spacing.sm};
  background: none;
  border: none;
  white-space: nowrap;
  flex-shrink: 0;
  transition: border-color 0.2s ease;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${({ $active }) => ($active ? theme.colors.text.primary : 'transparent')};
    z-index: 1;
  }

  ${({ $fullWidth }) =>
    $fullWidth &&
    `
    flex: 1;
    text-align: center;
  `}
`;

export const StyledTabLabel = styled.span<{ $active: boolean }>`
  font-size: ${theme.typography.fontSize.xs};
  font-weight: 500;
  color: ${({ $active }) => ($active ? theme.colors.text.primary : theme.colors.text.secondary)};
  transition: color 0.2s ease;
`;
