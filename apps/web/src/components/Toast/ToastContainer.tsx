import type { ToastEntry } from '@context/ToastProvider';

import { ToastViewport } from './styles';
import { Toast } from './Toast';

interface ToastContainerProps {
  toasts: ToastEntry[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <ToastViewport>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          variant={toast.variant}
          onDismiss={() => onDismiss(toast.id)}
        />
      ))}
    </ToastViewport>
  );
}
