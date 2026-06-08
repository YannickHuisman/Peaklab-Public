import styled, { css } from 'styled-components';

import { theme } from '@package/ui';

import {
  defaultFormControlStyles,
  dropdownArrowDefault,
  dropdownArrowFocused,
  dropdownArrowInline,
  type FormControlVariant,
  inlineFormControlStyles,
  StyledFormWrapper,
  StyledLabel,
} from '../styles.shared';

// Re-export shared components
export { StyledLabel, StyledFormWrapper as StyledSelectWrapper };
export type { FormControlVariant };

const defaultSelectStyles = css`
  ${defaultFormControlStyles}
  padding-right: ${theme.spacing.xl};
  cursor: pointer;
  appearance: none;
  background-image: ${dropdownArrowDefault};
  background-repeat: no-repeat;
  background-position: right ${theme.spacing.sm} center;
`;

const inlineSelectStyles = css`
  ${inlineFormControlStyles}
  padding-right: 16px;
  cursor: pointer;
  appearance: none;
  background-image: ${dropdownArrowInline};
  background-repeat: no-repeat;
  background-position: right 0 center;

  &:focus {
    background-image: ${dropdownArrowFocused};
  }
`;

export const StyledSelect = styled.select<{ $variant?: 'default' | 'inline' }>`
  ${({ $variant }) => ($variant === 'inline' ? inlineSelectStyles : defaultSelectStyles)}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
