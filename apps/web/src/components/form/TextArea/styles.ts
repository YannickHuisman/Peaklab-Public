import styled from 'styled-components';

import { theme } from '@package/ui';

import {
  defaultFormControlStyles,
  type FormControlVariant,
  StyledFormWrapper,
  StyledLabel,
} from '../styles.shared';

export { StyledLabel, StyledFormWrapper as StyledTextAreaWrapper };
export type { FormControlVariant };

export const StyledTextArea = styled.textarea<{ $variant?: FormControlVariant }>`
  ${defaultFormControlStyles}
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;

  &::placeholder {
    color: ${theme.colors.text.muted};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
