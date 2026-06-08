import type { Request, Response } from 'express';

import { supabaseAdmin } from '../../helpers/supabaseClient';
import type { AuthenticatedRequest } from '../../types';

const ALLOWED_FIELDS = [
  'language',
  'region',
  'units',
  'date_format',
  'theme',
  'analytics_enabled',
  'personalised_recommendations',
  'share_data_with_partners',
  'activity_visibility',
  'email_weekly_report',
  'email_new_results',
  'email_appointment_reminders',
  'push_new_results',
  'push_community_updates',
  'push_marketing_updates',
  'ai_context_profile',
  // 'ai_context_biomarkers',
  'ai_context_performance_plan',
] as const;

/**
 * Get user settings — creates default row if none exists
 */
export const getUserSettings = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;

    // Try to fetch existing settings
    const { data, error } = await supabaseAdmin
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code === 'PGRST116') {
      // No row found — insert defaults
      const { data: created, error: insertError } = await supabaseAdmin
        .from('user_settings')
        .insert({ user_id: user.id })
        .select()
        .single();

      if (insertError) throw insertError;

      return res.json({ settings: created });
    }

    if (error) throw error;

    res.json({ settings: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

/**
 * Update user settings (partial update)
 */
export const updateUserSettings = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;

    // Whitelist fields
    const updates: Record<string, unknown> = {};

    for (const key of ALLOWED_FIELDS) {
      if (key in req.body) {
        updates[key] = req.body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updates.updated_at = new Date().toISOString();

    // Upsert: create if not exists, update if exists
    const { data, error } = await supabaseAdmin
      .from('user_settings')
      .upsert({ user_id: user.id, ...updates }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;

    res.json({ settings: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};
