import { type Dispatch, type SetStateAction, useCallback } from 'react';

import type { FormState } from './types';

type ArrayItem<T, K extends keyof T> = T[K] extends Array<infer U> ? U : never;

export function useFormArrays<T>(setState: Dispatch<SetStateAction<FormState<T>>>) {
  const updateArray = useCallback(
    <K extends keyof T>(field: K, mutate: (current: ArrayItem<T, K>[]) => ArrayItem<T, K>[]) => {
      setState((prev) => {
        const current = prev.values[field];

        if (!Array.isArray(current)) return prev;

        return {
          ...prev,
          values: { ...prev.values, [field]: mutate(current as ArrayItem<T, K>[]) },
          isDirty: true,
        };
      });
    },
    [setState]
  );

  const addArrayItem = useCallback(
    <K extends keyof T>(field: K, item: ArrayItem<T, K>) => {
      updateArray(field, (current) => [...current, item]);
    },
    [updateArray]
  );

  const removeArrayItem = useCallback(
    <K extends keyof T>(field: K, index: number) => {
      updateArray(field, (current) => current.filter((_, i) => i !== index));
    },
    [updateArray]
  );

  const updateArrayItem = useCallback(
    <K extends keyof T>(field: K, index: number, value: ArrayItem<T, K>) => {
      updateArray(field, (current) => {
        const next = [...current];

        next[index] = value;

        return next;
      });
    },
    [updateArray]
  );

  const toggleArrayItem = useCallback(
    <K extends keyof T>(field: K, item: ArrayItem<T, K>) => {
      updateArray(field, (current) => {
        const index = current.indexOf(item);

        if (index > -1) return current.filter((_, i) => i !== index);

        return [...current, item];
      });
    },
    [updateArray]
  );

  return { addArrayItem, removeArrayItem, updateArrayItem, toggleArrayItem };
}
