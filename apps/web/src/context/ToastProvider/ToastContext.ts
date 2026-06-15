import { createContext } from 'react';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastEntry {
  id: string;
  message: string;
  variant: ToastVariant;
}

export interface ToastContextValue {
  /** Show a transient toast. Defaults to the `error` variant. */
  showToast: (message: string, variant?: ToastVariant) => void;
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);
