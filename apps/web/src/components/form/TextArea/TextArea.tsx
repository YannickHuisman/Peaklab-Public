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
  ({ label, error, id, variant = 'default', ...props }, ref) => {
    const textareaId = id || generateFormId('textarea', label);

    return (
      <StyledTextAreaWrapper $variant={variant}>
        {label && <StyledLabel htmlFor={textareaId}>{label}</StyledLabel>}
        <StyledTextArea ref={ref} id={textareaId} $variant={variant} {...props} />
        {error && <span className="error">{error}</span>}
      </StyledTextAreaWrapper>
    );
  }
);

TextArea.displayName = 'TextArea';
