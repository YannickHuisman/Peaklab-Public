import { useState } from 'react';

import { authenticatedFetch } from '../../utils/authenticatedFetch';
import { useAuth } from '../useAuth';

// Training-schema generation runs in the background on the server (the POST
// returns 202 with a job id) and the client polls for the result. The backend
// caps the LLM call at 8 minutes, so we stop polling a little after that.
const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 9 * 60 * 1000; // 9 minutes

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

interface RecoveryMethod {
  active: boolean;
  frequency?: 'rarely' | 'sometimes' | 'regular';
}

interface CurrentLimitations {
  energy_recovery: string[];
  sleep_stress: string[];
  muscles_joints: string[];
  cognition_digestion: string[];
}

interface TrainingSchemaInput {
  age: number;
  gender?: string;
  heightCm?: number;
  weightKg?: number;
  primarySportType?: string;
  primaryGoal: string;
  primaryGoalTimelineMonths?: number;
  secondaryGoals?: string[];
  currentLimitations?: CurrentLimitations;
  sleepHoursPerNight?: number;
  stressLevel?: number;
  dailyCalorieIntake?: number;
  nutritionPatterns?: string[];
  recoveryMethods?: Record<string, RecoveryMethod>;
  trainingHoursPerWeek?: number;
  highIntensitySessionsPerWeek?: number;
  currentLevelDescription?: string;
  secondaryGoalCurrentLevels?: string[];
  biomarkers?: Record<string, unknown>;
}

interface TrainingSchemaResponse {
  success: boolean;
  performanceTips?: {
    tips_by_goal: Record<
      string,
      {
        goal: string;
        tips: Array<{
          id: string;
          category: string;
          title: string;
          description: string;
          source_url?: string;
        }>;
      }
    >;
    selected_tip_ids?: string[];
  };
  userId: string;
  aiProvider?: string;
}

export const useAI = () => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Poll a background training-schema job until it completes, fails, or we give
  // up. Transient network errors during polling are ignored so a blip doesn't
  // abort a generation that's still running on the server.
  const pollTrainingSchemaJob = async (jobId: string): Promise<TrainingSchemaResponse> => {
    const startedAt = Date.now();

    while (Date.now() - startedAt < POLL_TIMEOUT_MS) {
      await delay(POLL_INTERVAL_MS);

      let pollRes: Response;

      try {
        pollRes = await authenticatedFetch(`/api/ai/training-schema/${jobId}`);
      } catch {
        continue;
      }

      if (pollRes.status === 404) throw new Error('Generatie-taak niet gevonden');
      if (!pollRes.ok) continue;

      const data = (await pollRes.json().catch(() => null)) as
        | (TrainingSchemaResponse & { status?: string; error?: string })
        | null;

      if (!data) continue;
      if (data.status === 'completed') return data;
      if (data.status === 'failed') throw new Error(data.error || 'Generatie mislukt');
      // status === 'generating' → keep polling
    }

    throw new Error('Generatie duurde te lang en is gestopt');
  };

  const generateTrainingSchema = async (
    input: TrainingSchemaInput,
    // Called as soon as the server hands back a job id, before polling — so the
    // caller can persist it and resume the same job after a reload.
    onJobCreated?: (jobId: string) => void
  ): Promise<TrainingSchemaResponse> => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      // Kick off generation — the server responds immediately (202) with a job
      // id and runs the slow LLM call in the background.
      const startRes = await authenticatedFetch('/api/ai/training-schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!startRes.ok) {
        const errorData = await startRes.json().catch(() => ({}));

        throw new Error(errorData.error || 'Request failed');
      }

      const { jobId } = (await startRes.json()) as { jobId?: string };

      if (!jobId) throw new Error('Geen job-id ontvangen van de server');

      onJobCreated?.(jobId);

      return await pollTrainingSchemaJob(jobId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';

      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Resume polling a job that was started earlier (e.g. before a page reload).
  const resumeTrainingSchema = async (jobId: string): Promise<TrainingSchemaResponse> => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      return await pollTrainingSchemaJob(jobId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';

      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    generateTrainingSchema,
    resumeTrainingSchema,
  };
};
