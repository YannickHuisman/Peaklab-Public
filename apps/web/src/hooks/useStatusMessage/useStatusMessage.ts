import { useCallback, useEffect, useState } from 'react';

export type StatusMessage = {
  type: 'success' | 'error';
  text: string;
} | null;

export function useStatusMessage(autoDismissMs = 4000) {
  const [message, setMessage] = useState<StatusMessage>(null);

  useEffect(() => {
    if (message?.type !== 'success') return;

    const timer = setTimeout(() => setMessage(null), autoDismissMs);

    return () => clearTimeout(timer);
  }, [message, autoDismissMs]);

  const showSuccess = useCallback((text: string) => setMessage({ type: 'success', text }), []);
  const showError = useCallback((text: string) => setMessage({ type: 'error', text }), []);
  const clear = useCallback(() => setMessage(null), []);

  return { message, showSuccess, showError, clear, setMessage };
}
