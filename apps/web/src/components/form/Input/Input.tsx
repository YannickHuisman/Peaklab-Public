import { forwardRef, type ReactNode } from 'react';

import { generateFormId } from '../styles.shared';
import {
  type FormControlVariant,
  StyledIconContainer,
  StyledInput,
  StyledInputContainer,
  StyledInputRow,
  StyledInputWrapper,
  StyledLabel,
  StyledSuffix,
} from './styles';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  /** Use 'inline' for minimal styling that blends into surrounding text */
  variant?: FormControlVariant;
  /** Suffix text displayed after the input (e.g., "kg", "cm") */
  suffix?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, id, variant = 'default', suffix, style, ...props }, ref) => {
    const inputId = id || generateFormId('input', label);
    const hasValue = !!props.value && String(props.value).length > 0;

    const inputContent = (
      <StyledInputContainer>
        {icon && variant !== 'inline' && (
          <StyledIconContainer $hasValue={hasValue}>{icon}</StyledIconContainer>
        )}
        <StyledInput
          ref={ref}
          id={inputId}
          $hasIcon={!!icon}
          $variant={variant}
          style={style}
          {...props}
        />
      </StyledInputContainer>
    );

    return (
      <StyledInputWrapper $variant={variant}>
        {label && variant !== 'inline' && <StyledLabel htmlFor={inputId}>{label}</StyledLabel>}
        {suffix ? (
          <StyledInputRow>
            {inputContent}
            <StyledSuffix>{suffix}</StyledSuffix>
          </StyledInputRow>
        ) : (
          inputContent
        )}
        {error && <span className="error">{error}</span>}
      </StyledInputWrapper>
    );
  }
);

Input.displayName = 'Input';
