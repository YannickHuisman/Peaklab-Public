import { Input } from '@components/form/Input';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn } from '@components/styled/layout';

import { StyledFormRow } from '../styles';
import type { BiomarkerFormData } from './types';

type RangeFieldKey = Extract<
  keyof BiomarkerFormData,
  | 'ref_male_min'
  | 'ref_male_max'
  | 'ref_female_min'
  | 'ref_female_max'
  | 'performance_male_min'
  | 'performance_male_max'
  | 'performance_female_min'
  | 'performance_female_max'
>;

type FieldProps = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  error?: string;
};

interface RangeRowProps {
  label: string;
  minField: RangeFieldKey;
  maxField: RangeFieldKey;
  getFieldProps: (field: keyof BiomarkerFormData) => FieldProps;
  minPlaceholder?: string;
  maxPlaceholder?: string;
}

export function RangeRow({
  label,
  minField,
  maxField,
  getFieldProps,
  minPlaceholder = 'e.g., 8.5',
  maxPlaceholder = 'e.g., 10.5',
}: RangeRowProps) {
  return (
    <FlexColumn $gap="xs" $mt="xs">
      <Paragraph $size="small" $variant="secondary">
        {label}
      </Paragraph>
      <StyledFormRow>
        <Input
          label="Min"
          type="number"
          step="any"
          {...getFieldProps(minField)}
          placeholder={minPlaceholder}
        />
        <Input
          label="Max"
          type="number"
          step="any"
          {...getFieldProps(maxField)}
          placeholder={maxPlaceholder}
        />
      </StyledFormRow>
    </FlexColumn>
  );
}
