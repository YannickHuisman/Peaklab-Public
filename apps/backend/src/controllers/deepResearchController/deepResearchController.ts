import type { Request, Response } from 'express';

import { getLabRangesMap, resolveRanges } from '../../helpers/biomarkerRanges';
import { supabaseAdmin } from '../../helpers/supabaseClient';
import type { EnrichedBiomarkerResult } from '../../services/ai';
import {
  buildDeepResearchPrompt,
  calculateRatios,
  deepResearchCompletion,
  groupBiomarkersByDomain,
  jsonCompletion,
} from '../../services/ai';
import type { AuthenticatedRequest } from '../../types';

export const generateDeepResearch = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;

    // Rate limit: once per 30 days
    const thirtyDaysAgo = new Date();

    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: recentReport } = await supabaseAdmin
      .from('deep_research_reports')
      .select('id, created_at')
      .eq('user_id', user.id)
      .neq('status', 'failed')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (recentReport) {
      const nextAvailable = new Date(recentReport.created_at);

      nextAvailable.setDate(nextAvailable.getDate() + 30);

      return res.status(429).json({
        error: 'Een deep research rapport kan slechts eenmaal per maand worden gegenereerd',
        nextAvailableAt: nextAvailable.toISOString(),
      });
    }

    // Fetch latest completed blood test
    const { data: latestTest } = await supabaseAdmin
      .from('blood_tests')
      .select('id, sample_taken_at, lab_id')
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

    // Create the report record (generating state)
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

    // Return immediately with 202
    res.status(202).json({
      reportId: report.id,
      status: 'generating',
    });

    // Fire-and-forget: generate the report asynchronously
    generateReportAsync(report.id, user.id, latestTest.id, latestTest.lab_id).catch((err) => {
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
  bloodTestId: string,
  labId: number | null
): Promise<void> {
  try {
    // Fetch all data in parallel
    const [labRangesMap, profileResult, performanceResult, biomarkerResults] = await Promise.all([
      getLabRangesMap(labId),
      supabaseAdmin
        .from('profiles')
        .select('gender, weight_kg, birth_date')
        .eq('id', userId)
        .single(),
      supabaseAdmin.from('performance_profiles').select('form_data').eq('user_id', userId).single(),
      supabaseAdmin
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
            category:category_id(id, name)
          )
        `
        )
        .eq('blood_test_id', bloodTestId),
    ]);

    const profile = profileResult.data;
    const rawResults = biomarkerResults.data || [];

    // Enrich biomarker results with lab-specific ranges
    const enrichedResults: EnrichedBiomarkerResult[] = rawResults
      .filter((r) => r.biomarker)
      .map((result) => {
        const biomarker = result.biomarker as unknown as Record<string, unknown>;
        const ranges = resolveRanges(biomarker, labRangesMap);

        return {
          value: result.value,
          flag: result.flag,
          biomarker: {
            ...(biomarker as EnrichedBiomarkerResult['biomarker']),
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
        } as EnrichedBiomarkerResult;
      });

    if (enrichedResults.length === 0) {
      await supabaseAdmin
        .from('deep_research_reports')
        .update({
          status: 'failed',
          error_message: 'Geen biomarker resultaten gevonden voor deze bloedtest',
        })
        .eq('id', reportId);

      return;
    }

    // Calculate age from birth date
    let age: number | null = null;

    if (profile?.birth_date) {
      const birthDate = new Date(profile.birth_date);
      const now = new Date();

      age = now.getFullYear() - birthDate.getFullYear();

      const monthDiff = now.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
        age--;
      }
    }

    // Group by domain and calculate ratios
    const domains = groupBiomarkersByDomain(enrichedResults, profile?.gender ?? null);
    const ratios = calculateRatios(enrichedResults);

    // Extract heightCm from performance profile form_data (only basic biometric used in research)
    const heightCm =
      ((performanceResult.data?.form_data as Record<string, unknown> | null)?.heightCm as
        | number
        | null) ?? null;

    // Build the prompt and call AI
    const prompt = buildDeepResearchPrompt(domains, ratios, {
      age,
      gender: profile?.gender,
      weightKg: profile?.weight_kg,
      heightCm,
    });

    // Step 1: Use OpenAI deep research for thorough, evidence-based analysis with web search
    console.warn('[DeepResearch] Starting o3-deep-research for report', reportId);

    const researchOutput = await deepResearchCompletion({ prompt });

    console.warn(
      '[DeepResearch] Deep research completed, structuring into JSON for report',
      reportId
    );

    // Step 2: Use gpt-4o to structure the deep research output into the expected JSON format
    const reportData = await jsonCompletion({
      model: 'gpt-4o',
      systemPrompt:
        'Je bent een data-structureerder. Je krijgt een uitgebreid deep research rapport over biomarkers van een sporter. ' +
        'Structureer dit rapport in het gevraagde JSON-formaat. Behoud alle specifieke details, waarden en inzichten uit het onderzoek. ' +
        'Vertaal alles naar het Nederlands als dat nog niet het geval is. Geef nooit medische diagnoses. ' +
        'Antwoord ALLEEN in valid JSON.',
      userPrompt:
        `Hier is het uitgebreide deep research rapport:\n\n${researchOutput}\n\n` +
        'Structureer dit rapport in exact dit JSON-formaat:\n\n' +
        '{\n' +
        '  "executive_summary": "Korte samenvatting van de 3-5 belangrijkste bevindingen (max 200 woorden)",\n' +
        '  "overall_score": <getal 0-100>,\n' +
        '  "domains": [\n' +
        '    {\n' +
        '      "name": "Domeinnaam",\n' +
        '      "score": <getal 0-100>,\n' +
        '      "status": "optimal|good|attention|concern",\n' +
        '      "summary": "Samenvatting (2-3 zinnen)",\n' +
        '      "biomarkers": [\n' +
        '        {\n' +
        '          "name": "biomarker_naam",\n' +
        '          "value": <waarde>,\n' +
        '          "unit": "eenheid",\n' +
        '          "status": "optimal|good|attention|concern",\n' +
        '          "interpretation": "Interpretatie (1-2 zinnen)"\n' +
        '        }\n' +
        '      ],\n' +
        '      "insights": ["Inzicht 1", "Inzicht 2"]\n' +
        '    }\n' +
        '  ],\n' +
        '  "ratios": [\n' +
        '    {\n' +
        '      "name": "Ratio naam",\n' +
        '      "value": <waarde>,\n' +
        '      "optimal_range": "bereik",\n' +
        '      "status": "optimal|good|attention|concern",\n' +
        '      "interpretation": "Interpretatie (1-2 zinnen)"\n' +
        '    }\n' +
        '  ],\n' +
        '  "performance_impact": {\n' +
        '    "strengths": ["Sterkte 1", "Sterkte 2"],\n' +
        '    "areas_for_improvement": ["Verbeterpunt 1"],\n' +
        '    "sport_specific_notes": "Sport-specifieke opmerkingen"\n' +
        '  },\n' +
        '  "recommendations": [\n' +
        '    {\n' +
        '      "priority": "high|medium|low",\n' +
        '      "category": "voeding|supplementen|lifestyle|training|herstel",\n' +
        '      "title": "Actietitel (max 8 woorden)",\n' +
        '      "description": "Uitleg (2-4 zinnen)"\n' +
        '    }\n' +
        '  ]\n' +
        '}\n\n' +
        'BELANGRIJK:\n' +
        '- Behoud alle specifieke bevindingen uit het deep research rapport\n' +
        '- Sorteer recommendations op prioriteit (high eerst)\n' +
        '- Geef minimaal 5 en maximaal 10 recommendations\n' +
        '- Elk domein moet minstens 1 insight hebben\n' +
        '- Focus op performance optimalisatie, geen medische diagnoses',
      maxTokens: 4096,
    });

    // Extract summary and update the report
    const data = reportData as Record<string, unknown>;

    await supabaseAdmin
      .from('deep_research_reports')
      .update({
        status: 'completed',
        report_data: data,
        summary: (data.executive_summary as string) || null,
        completed_at: new Date().toISOString(),
      })
      .eq('id', reportId);

    // Create a user notification so they know the report is ready
    await supabaseAdmin.from('user_notifications').insert({
      user_id: userId,
      type: 'deep_research_completed',
      title: 'Deep Research voltooid',
      message: 'Je uitgebreide biomarker analyse is klaar. Bekijk nu je persoonlijke rapport.',
      reference_id: reportId,
    });

    console.warn('[DeepResearch] Report completed and notification created for', reportId);
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
