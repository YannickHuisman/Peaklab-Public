import type { FieldValidator } from '@hooks/useForm';

import type { BiomarkerFormData } from './types';

export function makeMinValidator(
  maxField: keyof BiomarkerFormData
): FieldValidator<BiomarkerFormData> {
  return (value, formData) => {
    if (!value || !formData) return null;
    const max = formData[maxField];

    if (max && Number(value) >= Number(max)) {
      return 'Min must be less than max';
    }

    return null;
  };
}

export function makeMaxValidator(
  minField: keyof BiomarkerFormData
): FieldValidator<BiomarkerFormData> {
  return (value, formData) => {
    if (!value || !formData) return null;
    const min = formData[minField];

    if (min && Number(value) <= Number(min)) {
      return 'Max must be greater than min';
    }

    return null;
  };
}
