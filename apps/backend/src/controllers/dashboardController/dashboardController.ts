import type { Request, Response } from 'express';

import { supabaseAdmin } from '../../helpers/supabaseClient';
import { loadUserBiomarkerData } from '../../services/biomarkerData';
import type { AuthenticatedRequest } from '../../types';

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('panel_id')
      .eq('id', user.id)
      .single();

    const [biomarkerData, goalsResult, performanceResult, peakScoresResult] = await Promise.all([
      loadUserBiomarkerData({
        userId: user.id,
        source: { kind: 'latestPerBiomarker', panelId: profile?.panel_id ?? null },
        includeContent: true,
      }),
      supabaseAdmin.from('goals').select('*').eq('user_id', user.id).eq('is_active', true),
      supabaseAdmin
        .from('performances')
        .select('*')
        .eq('user_id', user.id)
        .order('performed_at', { ascending: false })
        .limit(5),
      supabaseAdmin
        .from('peak_scores')
        .select('score, calculated_at')
        .eq('user_id', user.id)
        .order('calculated_at', { ascending: true }),
    ]);

    res.json({
      latestTest: biomarkerData.latestTest,
      biomarkers: [...biomarkerData.direct, ...biomarkerData.derived],
      goals: goalsResult.data,
      performance: performanceResult.data,
      peakScores: peakScoresResult.data,
      userGender: biomarkerData.gender,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};
