import type { FormConfig } from './types';
import { useFormArrays } from './useFormArrays';
import { useFormCore } from './useFormCore';
import { useFormSteps } from './useFormSteps';

export function useForm<T extends object>(config: FormConfig<T>) {
  const { stepValidation = {}, totalSteps = 1 } = config;

  const core = useFormCore<T>(config);
  const steps = useFormSteps<T>({
    state: core.state,
    setState: core.setState,
    totalSteps,
    stepValidation,
  });
  const arrays = useFormArrays<T>(core.setState);

  return {
    values: core.state.values,
    errors: core.state.errors,
    touched: core.state.touched,
    isDirty: core.state.isDirty,
    isSubmitting: core.state.isSubmitting,
    isValidating: core.state.isValidating,
    isValid: core.isValid,
    setFieldValue: core.setFieldValue,
    setFieldTouched: core.setFieldTouched,
    getFieldProps: core.getFieldProps,
    getFieldState: core.getFieldState,
    setValues: core.setValues,
    handleSubmit: core.handleSubmit,
    reset: core.reset,
    validateForm: core.validateForm,
    validateField: core.validateField,
    handleChange: core.handleChange,
    handleBlur: core.handleBlur,
    ...steps,
    ...arrays,
  };
}
