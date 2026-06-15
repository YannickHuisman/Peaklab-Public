import { forwardRef } from 'react';

import { generateFormId } from '../styles.shared';
import {
  type FormControlVariant,
  StyledLabel,
  StyledTextArea,
  StyledTextAreaWrapper,
} from './styles';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  variant?: FormControlVariant;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, id, variant = 'default', 'aria-label': ariaLabel, ...props }, ref) => {
    const textareaId = id || generateFormId('textarea', label);
    const errorId = `${textareaId}-error`;

    return (
      <StyledTextAreaWrapper $variant={variant}>
        {label && <StyledLabel htmlFor={textareaId}>{label}</StyledLabel>}
        <StyledTextArea
          ref={ref}
          id={textareaId}
          $variant={variant}
          aria-label={!label ? (ariaLabel ?? undefined) : ariaLabel}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        {error && (
          <span className="error" id={errorId} role="alert">
            {error}
          </span>
        )}
      </StyledTextAreaWrapper>
    );
  }
);

TextArea.displayName = 'TextArea';
