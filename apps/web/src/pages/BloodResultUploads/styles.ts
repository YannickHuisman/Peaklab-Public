import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledDropZone = styled.div<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing['2xl']};
  border: 2px dashed
    ${({ $active }) => ($active ? theme.colors.accent.hero.main : theme.colors.border.subtle)};
  border-radius: ${theme.borderRadius.lg};
  cursor: pointer;
  transition: all ${theme.transitions.duration.fast} ease;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    border-color: ${theme.colors.accent.hero.main};
    background-color: ${theme.colors.accent.hero.main}08;
  }

  ${({ $active }) =>
    $active &&
    `
    background-color: ${theme.colors.accent.hero.main}08;
  `}
`;

export const StyledFileInput = styled.input`
  display: none;
`;

export const StyledStatusBadge = styled.span<{ $tone?: string }>`
  display: inline-flex;
  align-items: center;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: 600;
  white-space: nowrap;

  ${({ $tone }) => {
    switch ($tone) {
      case 'success':
        return `
          background-color: ${theme.colors.accent.green.soft};
          color: ${theme.colors.accent.green.strong};
        `;
      case 'error':
        return `
          background-color: ${theme.colors.error.soft};
          color: ${theme.colors.error.strong};
        `;
      case 'warning':
        return `
          background-color: ${theme.colors.accent.orange.soft};
          color: ${theme.colors.accent.orange.strong};
        `;
      case 'info':
        return `
          background-color: ${theme.colors.accent.blue.soft};
          color: ${theme.colors.accent.blue.strong};
        `;
      default:
        return `
          background-color: ${theme.colors.neutral[100]};
          color: ${theme.colors.text.secondary};
        `;
    }
  }}
`;
