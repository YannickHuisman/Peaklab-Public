import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledTooltipWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xxs};
`;

export const StyledTooltipIcon = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: help;
  flex-shrink: 0;

  &:hover > [role='tooltip'],
  &:focus > [role='tooltip'] {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
  }
`;

export const StyledTooltipContent = styled.span<{ $align?: 'left' | 'center' | 'right' }>`
  position: absolute;
  top: calc(100% + 6px);
  ${({ $align }) =>
    $align === 'right'
      ? 'right: 0;'
      : $align === 'center'
        ? 'left: 50%; transform: translateX(-50%) translateY(-4px);'
        : 'left: 0; transform: translateY(-4px);'}
  z-index: 100;
  min-width: 200px;
  max-width: 280px;
  background: ${theme.colors.neutral[900]};
  color: ${theme.colors.neutral[50]};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: 400;
  line-height: 1.5;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  pointer-events: none;
  opacity: 0;
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
  white-space: normal;
  box-shadow: ${theme.shadows.md};

  /* Arrow */
  &::before {
    content: '';
    position: absolute;
    top: -5px;
    ${({ $align }) =>
      $align === 'right'
        ? 'right: 6px;'
        : $align === 'center'
          ? 'left: 50%; transform: translateX(-50%);'
          : 'left: 6px;'}
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid ${theme.colors.neutral[900]};
  }
`;
