import { layoutStyles } from '@helpers/layoutUtils';
import styled, { css } from 'styled-components';

import type { StyledButtonProps } from './types';

const BUTTON_VARIANTS = {
  primary: css`
    background-color: ${(props) => props.theme.colors.accent.hero.main};
    color: ${(props) => props.theme.colors.text.inverse};
    &:hover {
      background-color: ${(props) => props.theme.colors.accent.hero.strong};
    }
  `,
  secondary: css`
    background-color: ${(props) => props.theme.colors.background.raised};
    color: ${(props) => props.theme.colors.text.primary};
    border: 1px solid ${(props) => props.theme.colors.border.subtle};
    &:hover {
      background-color: ${(props) => props.theme.colors.neutral[200]};
      border-color: ${(props) => props.theme.colors.border.strong};
    }
  `,
  ghost: css`
    background: none;
    color: ${(props) => props.theme.colors.text.primary};
    padding: 0;
  `,
};

const BUTTON_SIZES = {
  small: css`
    padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.md};
    font-size: ${(props) => props.theme.typography.fontSize.sm};
  `,
  medium: css`
    padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
    font-size: ${(props) => props.theme.typography.fontSize.base};
  `,
  large: css`
    padding: ${(props) => props.theme.spacing.md} ${(props) => props.theme.spacing.lg};
    font-size: ${(props) => props.theme.typography.fontSize.lg};
  `,
};

export type ButtonVariant = keyof typeof BUTTON_VARIANTS;
export type ButtonSize = keyof typeof BUTTON_SIZES;

export const StyledButton = styled.button<StyledButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.spacing.xs};
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  cursor: pointer;
  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};
  transition: background-color ${(props) => props.theme.transitions.duration.fast} ease;
  ${(props) => BUTTON_SIZES[props.$size || 'medium']}
  ${(props) => BUTTON_VARIANTS[props.$variant || 'primary']}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${layoutStyles}
`;
