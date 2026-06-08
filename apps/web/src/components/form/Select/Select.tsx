import { forwardRef } from 'react';

import { generateFormId } from '../styles.shared';
import { type FormControlVariant, StyledLabel, StyledSelect, StyledSelectWrapper } from './styles';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  /** Use 'inline' for minimal styling that blends into surrounding text */
  variant?: FormControlVariant;
  /** Options to display in the select */
  options: SelectOption[];
  /** Placeholder option text */
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, id, variant = 'default', options, placeholder = 'Selecteer', ...props },
    ref
  ) => {
    const selectId = id || generateFormId('select', label);

    return (
      <StyledSelectWrapper $variant={variant}>
        {label && variant !== 'inline' && <StyledLabel htmlFor={selectId}>{label}</StyledLabel>}
        <StyledSelect ref={ref} id={selectId} $variant={variant} {...props}>
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </StyledSelect>
        {error && <span className="error">{error}</span>}
      </StyledSelectWrapper>
    );
  }
);

Select.displayName = 'Select';
