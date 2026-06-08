import { useState } from 'react';

import { authenticatedFetch } from '../../utils/authenticatedFetch';
import { useAuth } from '../useAuth';

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
}

export const useAI = () => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeRequest = async <T>(endpoint: string, body: unknown): Promise<T> => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authenticatedFetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.error || 'Request failed');
      }

      const data = await response.json();

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';

      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateTrainingSchema = async (input: TrainingSchemaInput) => {
    return makeRequest<TrainingSchemaResponse>('/api/ai/training-schema', input);
  };

  return {
    loading,
    error,
    generateTrainingSchema,
  };
};
