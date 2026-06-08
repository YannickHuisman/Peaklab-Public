import type { ReactNode } from 'react';

import { Input } from '@components/form/Input';
import { Select } from '@components/form/Select';
import { Paragraph } from '@components/Paragraph';

import { StyledViewField } from '../styles';

interface SelectOption {
  value: string;
  label: string;
}

interface BaseProps {
  label: string;
  editing: boolean;
  fieldProps: {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onBlur: () => void;
    error?: string;
  };
  displayValue: ReactNode;
  placeholder?: string;
}

interface InputFieldProps extends BaseProps {
  type?: 'text' | 'date' | 'number' | 'email' | 'url';
  options?: never;
}

interface SelectFieldProps extends BaseProps {
  type: 'select';
  options: SelectOption[];
}

type EditableFieldProps = InputFieldProps | SelectFieldProps;

export function EditableField(props: EditableFieldProps) {
  const { label, editing, fieldProps, displayValue, placeholder } = props;

  if (editing && props.type === 'select') {
    return (
      <Select
        label={label}
        {...fieldProps}
        options={[...props.options]}
        placeholder={placeholder}
      />
    );
  }

  if (editing) {
    return (
      <Input label={label} type={props.type ?? 'text'} {...fieldProps} placeholder={placeholder} />
    );
  }

  return (
    <StyledViewField>
      <Paragraph $size="xsmall" $variant="tertiary" $allCaps>
        {label}
      </Paragraph>
      <Paragraph $weight={500}>{displayValue}</Paragraph>
    </StyledViewField>
  );
}
