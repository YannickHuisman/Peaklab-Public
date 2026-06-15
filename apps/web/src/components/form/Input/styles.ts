import styled, { css } from 'styled-components';

import { theme } from '@package/ui';

import {
  defaultFormControlStyles,
  type FormControlVariant,
  inlineFormControlStyles,
  StyledFormWrapper,
  StyledLabel,
  StyledSuffix,
} from '../styles.shared';

// Re-export shared components
export { StyledFormWrapper as StyledInputWrapper, StyledLabel, StyledSuffix };
export type { FormControlVariant };

export const StyledInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const StyledInputRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

export const StyledIconContainer = styled.div<{ $hasValue?: boolean }>`
  position: absolute;
  left: ${theme.spacing.md};
  display: flex;
  align-items: center;
  pointer-events: none;
  color: ${({ $hasValue }) => ($hasValue ? theme.colors.text.primary : theme.colors.text.muted)};
  transition: color ${theme.transitions.duration.fast} ease;
`;

const defaultInputStyles = css`
  ${defaultFormControlStyles}

  /* Remove number input spinners */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type='number'] {
    -moz-appearance: textfield;
    text-align: center;
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px ${theme.colors.background.raised} inset !important;
    -webkit-text-fill-color: ${theme.colors.text.primary} !important;
    transition: background-color 5000s ease-in-out 0s;
  }
`;

const inlineInputStyles = css`
  ${inlineFormControlStyles}

  /* Remove number input spinners */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type='number'] {
    -moz-appearance: textfield;
  }
`;

export const StyledInput = styled.input<{ $hasIcon?: boolean; $variant?: 'default' | 'inline' }>`
  ${({ $variant }) => ($variant === 'inline' ? inlineInputStyles : defaultInputStyles)}
  padding-left: ${({ $hasIcon, $variant }) =>
    $variant !== 'inline' && $hasIcon ? theme.spacing['2xl'] : undefined};

  &::placeholder {
    color: ${theme.colors.text.muted};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
