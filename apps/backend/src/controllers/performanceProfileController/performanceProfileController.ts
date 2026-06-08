import type { Request, Response } from 'express';

import { supabaseAdmin } from '../../helpers/supabaseClient';
import type { AuthenticatedRequest } from '../../types';

interface FormData {
  age?: number | null;
  gender?: string | null;
  heightCm?: number | null;
  weightKg?: number | null;
  primarySportType?: string | null;
  primaryGoal?: string;
  primaryGoalTimelineMonths?: number | null;
  secondaryGoals?: string[];
  currentLimitations?: Record<string, unknown>;
  sleepHoursPerNight?: number;
  stressLevel?: number;
  dailyCalorieIntake?: number;
  nutritionPatterns?: string[];
  recoveryMethods?: Record<string, unknown>;
  trainingHoursPerWeek?: number;
  highIntensitySessionsPerWeek?: number;
  currentLevelDescription?: string;
}

/**
 * Get user's performance profile
 */
export const getPerformanceProfile = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;

    const { data, error } = await supabaseAdmin
      .from('performance_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      throw error;
    }

    // Transform data to the expected format for the frontend
    const profile = data
      ? {
          form_data: data.form_data,
          plan_form_data: data.plan_form_data,
          ai_plan: data.ai_plan,
        }
      : null;

    res.json({ profile });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

/**
 * Save or update user's performance profile
 * Supports both new JSONB schema (form_data, ai_plan) and old individual columns schema
 */
export const savePerformanceProfile = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const { form_data, ai_plan } = req.body;

    // Validate that we have the expected data structure
    if (!form_data) {
      res.status(400).json({ error: 'form_data is required' });

      return;
    }

    const formData = form_data as FormData;

    // Check if profile exists
    const { data: existing } = await supabaseAdmin
      .from('performance_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    // Prepare profile data using JSONB schema
    // When ai_plan is provided, also store the current form_data as plan_form_data
    // This allows tracking which form_data was used to generate the plan
    const profileData: Record<string, unknown> = {
      form_data: formData,
      // Only update ai_plan and plan_form_data when a new plan is explicitly provided
      // If ai_plan is undefined (not provided), don't include it to preserve existing plan
      ...(ai_plan !== undefined
        ? {
            ai_plan: ai_plan,
            is_complete: !!ai_plan,
            plan_form_data: formData,
          }
        : {}),
    };

    let result;

    if (existing) {
      // Update existing profile
      const { data, error } = await supabaseAdmin
        .from('performance_profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }
      result = data;
    } else {
      // Create new profile
      const { data, error } = await supabaseAdmin
        .from('performance_profiles')
        .insert({
          ...profileData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }
      result = data;
    }

    res.json({ profile: result, success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};
