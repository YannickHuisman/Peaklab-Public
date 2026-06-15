import type { Request, Response } from 'express';

import { supabaseAdmin } from '../../helpers/supabaseClient';
import type { AuthenticatedRequest } from '../../types';

export const getUserBloodTests = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;

    const { data, error } = await supabaseAdmin
      .from('blood_tests')
      .select(
        `
        id, sample_taken_at, status,
        panel:panel_id (id, name, code)
      `
      )
      .eq('user_id', user.id)
      .order('sample_taken_at', { ascending: false });

    if (error) throw error;

    res.json({ tests: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};
