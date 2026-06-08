import type { Request, Response } from 'express';

import { getLabRangesMap, resolveRanges } from '../../helpers/biomarkerRanges';
import { supabaseAdmin } from '../../helpers/supabaseClient';
import type { AuthenticatedRequest } from '../../types';

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;

    // Get user's profile to determine panel filter and gender
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('panel_id, gender')
      .eq('id', user.id)
      .single();

    // Fetch core dashboard data in parallel where possible
    const [latestTestResult, goalsResult, performanceResult, peakScoresResult] = await Promise.all([
      supabaseAdmin
        .from('blood_tests')
        .select('id, sample_taken_at, lab_id, panel:panel_id(name)')
        .eq('user_id', user.id)
        .order('sample_taken_at', { ascending: false })
        .limit(1)
        .single(),
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

    // Get lab-specific ranges if user's latest test has a lab_id
    const labRangesMap = await getLabRangesMap(latestTestResult.data?.lab_id ?? null);

    // Build biomarker query (optionally filtered by panel)
    let markersQuery = supabaseAdmin
      .from('blood_test_results')
      .select(
        `
        value, flag,
        biomarker:biomarker_id (
          id, name, display_name, unit,
          ref_male_min, ref_male_max,
          ref_female_min, ref_female_max,
          performance_male_min, performance_male_max,
          performance_female_min, performance_female_max,
          is_active,
          biomarker_content (
            what_it_measures,
            why_relevant,
            interpretation,
            optimization_tips,
            scientific_sources,
            how_to_optimize
          ),
          category:category_id(id, name)
        ),
        blood_tests!inner ( sample_taken_at )
      `
      )
      .eq('blood_tests.user_id', user.id);

    if (profile?.panel_id) {
      const { data: panelBiomarkers } = await supabaseAdmin
        .from('panel_biomarkers')
        .select('biomarker_id')
        .eq('panel_id', profile.panel_id);

      const ids = panelBiomarkers?.map((pb) => pb.biomarker_id) || [];

      if (ids.length > 0) {
        markersQuery = markersQuery.in('biomarker_id', ids);
      }
    }

    const { data: rawMarkers } = await markersQuery;

    // Keep only the latest result per biomarker
    const latestByBiomarker = new Map<number, NonNullable<typeof rawMarkers>[number]>();

    for (const result of rawMarkers || []) {
      if (!result.biomarker) continue;
      const biomarker = result.biomarker as unknown as Record<string, unknown>;
      const id = biomarker.id as number;
      const bloodTest = result.blood_tests as unknown as Record<string, unknown> | null;
      const date = new Date((bloodTest?.sample_taken_at as string) || 0).getTime();
      const existing = latestByBiomarker.get(id);
      const existingBloodTest = existing?.blood_tests as unknown as Record<string, unknown> | null;
      const existingDate = existing
        ? new Date((existingBloodTest?.sample_taken_at as string) || 0).getTime()
        : 0;

      if (!existing || date > existingDate) {
        latestByBiomarker.set(id, result);
      }
    }

    // Enrich biomarker results with lab-specific ranges (fallback to biomarker defaults)
    // and flatten biomarker_content into the biomarker object
    const enrichedBiomarkers = Array.from(latestByBiomarker.values()).map((result) => {
      if (!result.biomarker) return result;

      const biomarker = result.biomarker as unknown as Record<string, unknown>;
      const rawContent = biomarker.biomarker_content;
      const content =
        ((Array.isArray(rawContent) ? rawContent[0] : rawContent) as Record<string, unknown>) || {};
      const ranges = resolveRanges(biomarker, labRangesMap);

      const { biomarker_content: _, ...biomarkerWithoutContent } = biomarker;

      return {
        ...result,
        biomarker: {
          ...biomarkerWithoutContent,
          ...content,
          unit: ranges.unit,
          ref_male_min: ranges.ref_male_min,
          ref_male_max: ranges.ref_male_max,
          ref_female_min: ranges.ref_female_min,
          ref_female_max: ranges.ref_female_max,
          performance_male_min: ranges.performance_male_min,
          performance_male_max: ranges.performance_male_max,
          performance_female_min: ranges.performance_female_min,
          performance_female_max: ranges.performance_female_max,
        },
      };
    });

    res.json({
      latestTest: latestTestResult.data,
      biomarkers: enrichedBiomarkers,
      goals: goalsResult.data,
      performance: performanceResult.data,
      peakScores: peakScoresResult.data,
      userGender: profile?.gender ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};
