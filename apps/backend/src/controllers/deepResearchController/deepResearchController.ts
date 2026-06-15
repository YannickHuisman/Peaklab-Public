import type { Request, Response } from 'express';

import { supabaseAdmin } from '../../helpers/supabaseClient';
import { getUserAIContextPreferences } from '../../helpers/userAISettings';
import {
  annotateReportWithValues,
  buildDeepResearchPrompt,
  buildStructuringConfig,
  calculateDomainScores,
  calculateOverallScore,
  calculateRatios,
  deepResearchCompletion,
  getActiveProviderName,
  groupBiomarkersByDomain,
  jsonCompletion,
} from '../../services/ai';
import { loadUserBiomarkerData } from '../../services/biomarkerData';
import type { AuthenticatedRequest } from '../../types';

export const generateDeepResearch = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;

    const prefs = await getUserAIContextPreferences(user.id);

    if (!prefs.biomarkers) {
      return res.status(400).json({
        error:
          'Biomarker-context is uitgeschakeld. Schakel "Biomarkers" in onder Instellingen → AI-context om een deep research rapport te genereren.',
      });
    }

    const thirtyDaysAgo = new Date();

    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: _recentReport } = await supabaseAdmin
      .from('deep_research_reports')
      .select('id, created_at')
      .eq('user_id', user.id)
      .neq('status', 'failed')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // TODO: uncomment when live
    // if (_recentReport) {
    //   const nextAvailable = new Date(_recentReport.created_at);

    //   nextAvailable.setDate(nextAvailable.getDate() + 30);

    //   return res.status(429).json({
    //     error: 'Een deep research rapport kan slechts eenmaal per maand worden gegenereerd',
    //     nextAvailableAt: nextAvailable.toISOString(),
    //   });
    // }

    const { data: latestTest } = await supabaseAdmin
      .from('blood_tests')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('sample_taken_at', { ascending: false })
      .limit(1)
      .single();

    if (!latestTest) {
      return res.status(400).json({
        error: 'Geen bloedtestresultaten beschikbaar. Upload eerst je bloedwaarden.',
      });
    }

    const { data: report, error: insertError } = await supabaseAdmin
      .from('deep_research_reports')
      .insert({
        user_id: user.id,
        blood_test_id: latestTest.id,
        status: 'generating',
      })
      .select('id')
      .single();

    if (insertError) throw insertError;

    res.status(202).json({ reportId: report.id, status: 'generating' });

    generateReportAsync(report.id, user.id, prefs).catch((err) => {
      console.error('[DeepResearch] Async generation failed:', err);
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

async function generateReportAsync(
  reportId: string,
  userId: string,
  prefs: { profile: boolean; biomarkers: boolean; performancePlan: boolean }
): Promise<void> {
  try {
    const { data: panelProfile } = await supabaseAdmin
      .from('profiles')
      .select('panel_id')
      .eq('id', userId)
      .single();

    const [biomarkerData, profileResult, performanceResult] = await Promise.all([
      loadUserBiomarkerData({
        userId,
        source: { kind: 'latestPerBiomarker', panelId: panelProfile?.panel_id ?? null },
      }),
      supabaseAdmin.from('profiles').select('weight_kg, birth_date').eq('id', userId).single(),
      supabaseAdmin.from('performance_profiles').select('form_data').eq('user_id', userId).single(),
    ]);

    if (biomarkerData.direct.length === 0) {
      await supabaseAdmin
        .from('deep_research_reports')
        .update({
          status: 'failed',
          error_message: 'Geen biomarker resultaten gevonden. Upload eerst je bloedwaarden.',
        })
        .eq('id', reportId);

      return;
    }

    const profile = profileResult.data;
    const age = computeAge(profile?.birth_date as string | null | undefined);
    const heightCm =
      ((performanceResult.data?.form_data as Record<string, unknown> | null)?.heightCm as
        | number
        | null) ?? null;

    const domains = groupBiomarkersByDomain(biomarkerData.direct, biomarkerData.gender);
    const ratios = calculateRatios(biomarkerData.derived, biomarkerData.derivedDefs);
    const overallScore = calculateOverallScore(domains);
    const domainScores = calculateDomainScores(domains);

    const prompt = buildDeepResearchPrompt(domains, ratios, {
      age: prefs.profile ? age : null,
      gender: prefs.profile ? biomarkerData.gender : null,
      weightKg: prefs.profile ? (profile?.weight_kg as number | null) : null,
      heightCm: prefs.profile ? heightCm : null,
    });

    const aiProvider = await getActiveProviderName();

    console.warn('[DeepResearch] Starting deep research for report', reportId);

    const researchOutput = await deepResearchCompletion({ prompt });

    console.warn('[DeepResearch] Structuring output into JSON for report', reportId);

    const reportData = await jsonCompletion(
      buildStructuringConfig(researchOutput, overallScore, domainScores)
    );

    const data = annotateReportWithValues(reportData as Record<string, unknown>, domains, ratios);

    await supabaseAdmin
      .from('deep_research_reports')
      .update({
        status: 'completed',
        report_data: data,
        summary: (data.executive_summary as string) || null,
        completed_at: new Date().toISOString(),
        ai_provider: aiProvider,
      })
      .eq('id', reportId);

    await supabaseAdmin.from('user_notifications').insert({
      user_id: userId,
      type: 'deep_research_completed',
      title: 'Deep Research voltooid',
      message: 'Je uitgebreide biomarker analyse is klaar. Bekijk nu je persoonlijke rapport.',
      reference_id: reportId,
    });

    console.warn('[DeepResearch] Report completed for', reportId);
  } catch (err) {
    console.error('[DeepResearch] Generation error:', err);

    await supabaseAdmin
      .from('deep_research_reports')
      .update({
        status: 'failed',
        error_message: err instanceof Error ? err.message : 'Onbekende fout bij het genereren',
      })
      .eq('id', reportId);
  }
}

function computeAge(birthDate: string | null | undefined): number | null {
  if (!birthDate) return null;

  const dob = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age--;
  }

  return age;
}

export const getDeepResearch = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;

    const { data, error } = await supabaseAdmin
      .from('deep_research_reports')
      .select('id, status, summary, created_at, completed_at, error_message, blood_test_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ reports: data || [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

export const getDeepResearchById = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('deep_research_reports')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!data) {
      return res.status(404).json({ error: 'Rapport niet gevonden' });
    }

    res.json({ report: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};
