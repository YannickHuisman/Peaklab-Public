import { type Dispatch, type SetStateAction, useCallback, useMemo } from 'react';

import type { FormState, StepValidation } from './types';

interface UseFormStepsParams<T> {
  state: FormState<T>;
  setState: Dispatch<SetStateAction<FormState<T>>>;
  totalSteps: number;
  stepValidation: Record<number, StepValidation<T>>;
}

export function useFormSteps<T>({
  state,
  setState,
  totalSteps,
  stepValidation,
}: UseFormStepsParams<T>) {
  const validateStep = useCallback(
    (step?: number): boolean => {
      const target = step ?? state.currentStep;
      const validator = stepValidation[target];

      return validator ? validator(state.values) : true;
    },
    [state.currentStep, state.values, stepValidation]
  );

  const nextStep = useCallback((): boolean => {
    if (state.currentStep >= totalSteps) return false;
    if (!validateStep()) return false;

    setState((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }));

    return true;
  }, [state.currentStep, totalSteps, validateStep, setState]);

  const previousStep = useCallback((): boolean => {
    if (state.currentStep <= 1) return false;

    setState((prev) => ({ ...prev, currentStep: prev.currentStep - 1 }));

    return true;
  }, [state.currentStep, setState]);

  const goToStep = useCallback(
    (step: number): boolean => {
      if (step < 1 || step > totalSteps) return false;

      setState((prev) => ({ ...prev, currentStep: step }));

      return true;
    },
    [totalSteps, setState]
  );

  const canProceed = useMemo(() => validateStep(), [validateStep]);

  return {
    currentStep: state.currentStep,
    totalSteps,
    isFirstStep: state.currentStep === 1,
    isLastStep: state.currentStep === totalSteps,
    canProceed,
    validateStep,
    nextStep,
    previousStep,
    goToStep,
  };
}
