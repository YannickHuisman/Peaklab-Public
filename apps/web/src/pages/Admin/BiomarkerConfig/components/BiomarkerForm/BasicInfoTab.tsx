import { Input } from '@components/form/Input';
import { FlexColumn } from '@components/styled/layout';

import type { BiomarkerCategory } from '@package/api';

import { StyledCheckboxWrapper, StyledFormGrid, StyledLabel, StyledSelect } from '../styles';
import { PanelSelector } from './PanelSelector';
import { RangeRow } from './RangeRow';
import type { BiomarkerFormData } from './types';

type FieldProps = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: () => void;
  error?: string;
};

interface PanelOption {
  id: number;
  name: string;
  code: string;
}

interface BasicInfoTabProps {
  values: BiomarkerFormData;
  errors: Partial<Record<keyof BiomarkerFormData, string>>;
  touched: Partial<Record<keyof BiomarkerFormData, boolean>>;
  categories: BiomarkerCategory[];
  panels: PanelOption[];
  selectedPanels: number[];
  loadingPanels: boolean;
  onPanelsChange: (ids: number[]) => void;
  setFieldValue: (field: keyof BiomarkerFormData, value: unknown) => void;
  getFieldProps: (field: keyof BiomarkerFormData) => FieldProps;
}

export function BasicInfoTab({
  values,
  errors,
  touched,
  categories,
  panels,
  selectedPanels,
  loadingPanels,
  onPanelsChange,
  setFieldValue,
  getFieldProps,
}: BasicInfoTabProps) {
  return (
    <StyledFormGrid>
      <Input label="Name" {...getFieldProps('name')} placeholder="e.g., Hemoglobin" required />
      <Input
        label="Display Name"
        {...getFieldProps('display_name')}
        placeholder="e.g., Hemoglobine"
        required
      />

      <FlexColumn $gap="xxs">
        <StyledLabel>Category *</StyledLabel>
        <StyledSelect
          {...getFieldProps('category_id')}
          onChange={(e) => setFieldValue('category_id', Number(e.target.value))}
          required
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </StyledSelect>
        {touched.category_id && errors.category_id && <span>{errors.category_id}</span>}
      </FlexColumn>

      <Input label="Unit" {...getFieldProps('unit')} placeholder="e.g., mmol/L, µg/L, %, etc." />

      <RangeRow
        label="Reference Range Male"
        minField="ref_male_min"
        maxField="ref_male_max"
        getFieldProps={getFieldProps}
      />
      <RangeRow
        label="Reference Range Female"
        minField="ref_female_min"
        maxField="ref_female_max"
        getFieldProps={getFieldProps}
      />
      <RangeRow
        label="Performance Range Male (Optional)"
        minField="performance_male_min"
        maxField="performance_male_max"
        getFieldProps={getFieldProps}
        minPlaceholder="e.g., 9"
        maxPlaceholder="e.g., 10"
      />
      <RangeRow
        label="Performance Range Female (Optional)"
        minField="performance_female_min"
        maxField="performance_female_max"
        getFieldProps={getFieldProps}
        minPlaceholder="e.g., 9"
        maxPlaceholder="e.g., 10"
      />

      <PanelSelector
        panels={panels}
        selectedIds={selectedPanels}
        loading={loadingPanels}
        onChange={onPanelsChange}
      />

      <StyledCheckboxWrapper>
        <input
          type="checkbox"
          checked={values.is_active}
          onChange={(e) => setFieldValue('is_active', e.target.checked)}
        />
        <span>Active</span>
      </StyledCheckboxWrapper>
    </StyledFormGrid>
  );
}
