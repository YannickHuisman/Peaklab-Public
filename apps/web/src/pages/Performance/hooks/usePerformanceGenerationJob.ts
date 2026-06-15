import { useCallback } from 'react';

import { useAuth } from '@package/api';

import type { PerformanceFormData } from '../types';

const JOB_KEY_PREFIX = 'peaklab:performance-job:';

export interface PerformanceGenerationJob {
  jobId: string;
  // The form data the plan was generated from, so the completed result can be
  // saved against exactly what the user submitted, even after a reload.
  formData: PerformanceFormData;
  // When the job was started — used to ignore clearly-expired jobs on resume
  // (the server evicts them after ~15 minutes).
  startedAt: number;
}

/**
 * Local (browser-only) persistence of an in-flight training-schema generation.
 * Mirrors how deep research survives a reload — but without a DB change: the
 * job id is stored so that, after a refresh, the client resumes polling the
 * same background job instead of resetting to step 1 and letting the user kick
 * off a duplicate generation. Scoped per user id.
 */
export function usePerformanceGenerationJob() {
  const { user } = useAuth();
  const key = user?.id ? `${JOB_KEY_PREFIX}${user.id}` : null;

  const loadJob = useCallback((): PerformanceGenerationJob | null => {
    if (!key) return null;

    try {
      const raw = localStorage.getItem(key);

      return raw ? (JSON.parse(raw) as PerformanceGenerationJob) : null;
    } catch {
      return null;
    }
  }, [key]);

  const saveJob = useCallback(
    (job: PerformanceGenerationJob) => {
      if (!key) return;

      try {
        localStorage.setItem(key, JSON.stringify(job));
      } catch {
        // Best-effort — a failure here only costs reload-resilience.
      }
    },
    [key]
  );

  const clearJob = useCallback(() => {
    if (!key) return;

    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore — nothing actionable if removal fails.
    }
  }, [key]);

  return { loadJob, saveJob, clearJob };
}
