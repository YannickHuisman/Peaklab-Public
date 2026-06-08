import { useCallback, useMemo, useState } from 'react';

import type { FieldValidator, FormConfig, FormState } from './types';

export function useFormCore<T extends object>(config: FormConfig<T>) {
  const { initialValues, validationRules = {}, requiredFields = [], onSubmit } = config;

  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isDirty: false,
    isSubmitting: false,
    isValidating: false,
    currentStep: 1,
  });

  const validateField = useCallback(
    async (field: keyof T, value: unknown, allValues: T): Promise<string | null> => {
      if (
        requiredFields.includes(field) &&
        (value === '' || value === null || value === undefined)
      ) {
        return 'This field is required';
      }

      const rules = validationRules as Record<string, FieldValidator<T>>;
      const validator = rules[field as string];

      if (!validator) return null;

      return (await validator(value, allValues)) || null;
    },
    [requiredFields, validationRules]
  );

  const validateForm = useCallback(async (): Promise<boolean> => {
    setState((prev) => ({ ...prev, isValidating: true }));

    const errors: Partial<Record<keyof T, string>> = {};
    const allValues = state.values;

    await Promise.all(
      (Object.keys(allValues) as (keyof T)[]).map(async (field) => {
        const error = await validateField(field, allValues[field], allValues);

        if (error) errors[field] = error;
      })
    );

    setState((prev) => ({ ...prev, errors, isValidating: false }));

    return Object.keys(errors).length === 0;
  }, [state.values, validateField]);

  const setFieldValue = useCallback(
    async (field: keyof T, value: unknown) => {
      const nextValues = { ...state.values, [field]: value };

      setState((prev) => ({
        ...prev,
        values: nextValues,
        isDirty: true,
      }));

      if (state.touched[field]) {
        const error = await validateField(field, value, nextValues);

        setState((prev) => ({
          ...prev,
          errors: { ...prev.errors, [field]: error || undefined },
        }));
      }
    },
    [state.values, state.touched, validateField]
  );

  const setFieldTouched = useCallback(
    async (field: keyof T, isTouched = true) => {
      setState((prev) => ({
        ...prev,
        touched: { ...prev.touched, [field]: isTouched },
      }));

      if (!isTouched) return;

      const error = await validateField(field, state.values[field], state.values);

      setState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [field]: error || undefined },
      }));
    },
    [state.values, validateField]
  );

  const handleChange = useCallback(
    (field: keyof T) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target;
        const value =
          target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;

        setFieldValue(field, value as T[keyof T]);
      },
    [setFieldValue]
  );

  const handleBlur = useCallback(
    (field: keyof T) => () => {
      setFieldTouched(field, true);
    },
    [setFieldTouched]
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      const allTouched = Object.keys(state.values).reduce<Partial<Record<keyof T, boolean>>>(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );

      setState((prev) => ({ ...prev, isSubmitting: true, touched: allTouched }));

      const isValid = await validateForm();

      if (!isValid) {
        setState((prev) => ({ ...prev, isSubmitting: false }));

        return;
      }

      try {
        await onSubmit(state.values);
        setState((prev) => ({ ...prev, isSubmitting: false, isDirty: false }));
      } catch (error) {
        setState((prev) => ({ ...prev, isSubmitting: false }));
        throw error;
      }
    },
    [state.values, validateForm, onSubmit]
  );

  const reset = useCallback(
    (values?: Partial<T>) => {
      setState({
        values: values ? { ...initialValues, ...values } : initialValues,
        errors: {},
        touched: {},
        isDirty: false,
        isSubmitting: false,
        isValidating: false,
        currentStep: 1,
      });
    },
    [initialValues]
  );

  const setValues = useCallback((values: Partial<T>) => {
    setState((prev) => ({
      ...prev,
      values: { ...prev.values, ...values },
      isDirty: true,
    }));
  }, []);

  const getFieldProps = useCallback(
    (field: keyof T) => ({
      name: field as string,
      value: String(state.values[field] ?? ''),
      onChange: handleChange(field),
      onBlur: handleBlur(field),
      error: state.touched[field] ? state.errors[field] : undefined,
    }),
    [state.values, state.errors, state.touched, handleChange, handleBlur]
  );

  const getFieldState = useCallback(
    (field: keyof T) => ({
      value: state.values[field],
      error: state.errors[field],
      touched: state.touched[field],
      isDirty: state.values[field] !== initialValues[field],
    }),
    [state.values, state.errors, state.touched, initialValues]
  );

  const isValid = useMemo(() => Object.keys(state.errors).length === 0, [state.errors]);

  return {
    state,
    setState,
    isValid,
    validateField,
    validateForm,
    setFieldValue,
    setFieldTouched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues,
    getFieldProps,
    getFieldState,
  };
}
