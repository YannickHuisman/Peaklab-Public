import { useCallback } from 'react';

import { useAuth } from '@package/api';

import type { PerformanceFormData } from '../types';

const DRAFT_KEY_PREFIX = 'peaklab:performance-draft:';

/**
 * Local (browser-only) persistence for the performance stepper while the user
 * is filling in the 7 steps but has not generated a plan yet. Keeps unsaved
 * progress across navigation/refresh without touching the database — the real
 * commit still happens on "Genereer plan". The draft is scoped per user id so
 * it never leaks between accounts on a shared browser.
 */
export function usePerformanceDraft() {
  const { user } = useAuth();
  const key = user?.id ? `${DRAFT_KEY_PREFIX}${user.id}` : null;

  const loadDraft = useCallback((): PerformanceFormData | null => {
    if (!key) return null;

    try {
      const raw = localStorage.getItem(key);

      return raw ? (JSON.parse(raw) as PerformanceFormData) : null;
    } catch {
      return null;
    }
  }, [key]);

  const saveDraft = useCallback(
    (formData: PerformanceFormData) => {
      if (!key) return;

      try {
        localStorage.setItem(key, JSON.stringify(formData));
      } catch {
        // Ignore quota / serialization errors — the draft is best-effort.
      }
    },
    [key]
  );

  const clearDraft = useCallback(() => {
    if (!key) return;

    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore — nothing actionable if removal fails.
    }
  }, [key]);

  return { loadDraft, saveDraft, clearDraft };
}
