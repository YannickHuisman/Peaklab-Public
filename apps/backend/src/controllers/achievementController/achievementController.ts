import type { Response } from 'express';

import { supabaseAdmin } from '../../helpers/supabaseClient';
import type { AuthenticatedRequest } from '../../types';

/**
 * Get all achievements for the authenticated user
 */
export const getMyAchievements = async (req: unknown, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const userId = user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: achievements, error } = await supabaseAdmin
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .order('achieved_at', { ascending: false });

    if (error) throw error;

    return res.json({ achievements: achievements || [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    return res.status(500).json({ error: message });
  }
};

/**
 * Create a new achievement
 */
export const createAchievement = async (req: unknown, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const userId = user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { category, title, value, reps, achieved_at } = (req as AuthenticatedRequest).body;

    if (!category || !title || !value || !achieved_at) {
      return res
        .status(400)
        .json({ error: 'category, title, value, and achieved_at are required' });
    }

    const validCategories = ['algemeen', 'kracht', 'hardlopen'];

    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const { data: achievement, error } = await supabaseAdmin
      .from('achievements')
      .insert({
        user_id: userId,
        category,
        title: String(title).slice(0, 200),
        value: String(value).slice(0, 100),
        reps: reps ? Number(reps) : null,
        achieved_at,
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({ achievement });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    return res.status(500).json({ error: message });
  }
};

/**
 * Delete an achievement (only own achievements)
 */
export const deleteAchievement = async (req: unknown, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const userId = user?.id;
    const { achievementId } = (req as AuthenticatedRequest).params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!achievementId) {
      return res.status(400).json({ error: 'achievementId is required' });
    }

    // Only allow deleting own achievements
    const { error } = await supabaseAdmin
      .from('achievements')
      .delete()
      .eq('id', achievementId)
      .eq('user_id', userId);

    if (error) throw error;

    return res.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    return res.status(500).json({ error: message });
  }
};
