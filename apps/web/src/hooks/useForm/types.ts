export type FieldValidator<T> = (
  value: unknown,
  formData?: T
) => string | null | Promise<string | null>;

export type StepValidation<T> = (values: T) => boolean;

export interface FormConfig<T extends object> {
  initialValues: T;
  validationRules?: Partial<Record<keyof T, FieldValidator<T>>>;
  requiredFields?: (keyof T)[];
  onSubmit: (values: T) => Promise<void> | void;
  stepValidation?: Record<number, StepValidation<T>>;
  totalSteps?: number;
}

export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isDirty: boolean;
  isSubmitting: boolean;
  isValidating: boolean;
  currentStep: number;
}
