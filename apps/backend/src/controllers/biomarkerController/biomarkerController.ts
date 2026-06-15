import type { Request, Response } from 'express';

import {
  computeDerivedHistory,
  fetchActiveDerivedBiomarkers,
} from '../../helpers/derivedBiomarkers';
import { supabaseAdmin } from '../../helpers/supabaseClient';
import type { AuthenticatedRequest } from '../../types';

interface DependencyInput {
  source_id: number;
  role: string;
  sort_order?: number;
}

const BIOMARKER_KINDS = ['direct', 'ratio', 'calculated'] as const;

type BiomarkerKind = (typeof BIOMARKER_KINDS)[number];

function normalizeKind(value: unknown): BiomarkerKind {
  return (BIOMARKER_KINDS as readonly string[]).includes(value as string)
    ? (value as BiomarkerKind)
    : 'direct';
}

async function syncDependencies(derivedId: number, dependencies: DependencyInput[]) {
  await supabaseAdmin.from('biomarker_dependencies').delete().eq('derived_id', derivedId);

  if (dependencies.length === 0) return;

  const rows = dependencies.map((dep, index) => ({
    derived_id: derivedId,
    source_id: dep.source_id,
    role: dep.role,
    sort_order: dep.sort_order ?? index,
  }));

  const { error } = await supabaseAdmin.from('biomarker_dependencies').insert(rows);

  if (error) throw error;
}

export const getBiomarkerHistory = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const { markerId } = req.params;
    const markerIdNum = Number(markerId);

    // Independent reads run together: the user's profile (panel + gender), every
    // blood test (id + date), and the marker's kind (whether its history is
    // stored or has to be recomputed). Parallel so the kind lookup adds no
    // latency on the common direct path.
    const [profileRes, testsRes, markerRes] = await Promise.all([
      supabaseAdmin
        .from('profiles')
        .select('panel_id, show_all_biomarkers, gender')
        .eq('id', user.id)
        .single(),
      supabaseAdmin.from('blood_tests').select('id, sample_taken_at').eq('user_id', user.id),
      supabaseAdmin.from('biomarkers').select('kind').eq('id', markerIdNum).maybeSingle(),
    ]);

    if (testsRes.error) throw testsRes.error;

    const profile = profileRes.data;
    const tests = testsRes.data ?? [];

    if (tests.length === 0) {
      return res.json({ history: [] });
    }

    const testIds = tests.map((t) => t.id);

    // When show_all_biomarkers is enabled, bypass panel filtering entirely.
    const panelId = profile?.show_all_biomarkers ? null : (profile?.panel_id ?? null);

    const kind = markerRes.data?.kind;

    // Ratios / calculated values have no stored rows in blood_test_results —
    // their history is recomputed per blood test from the source biomarkers. The
    // heavier derived-definition fetch only runs for those markers.
    if (kind === 'ratio' || kind === 'calculated') {
      const gender = (profile?.gender as 'male' | 'female' | 'other' | null) ?? null;

      // fetchActiveDerivedBiomarkers(panelId) doubles as the panel gate: a
      // derived biomarker only appears here when it (transitively) belongs to
      // the panel.
      const derivedDefs = await fetchActiveDerivedBiomarkers(panelId);
      const target = derivedDefs.find((d) => d.id === markerIdNum);

      if (!target) {
        return res.json({ history: [] });
      }

      const { data: results } = await supabaseAdmin
        .from('blood_test_results')
        .select('biomarker_id, value, blood_test_id')
        .in('blood_test_id', testIds);

      const dateByTestId = new Map(tests.map((t) => [t.id, t.sample_taken_at as string]));
      const valuesByTest = new Map<string, Map<number, number>>();

      for (const r of results ?? []) {
        const testId = r.blood_test_id as string;
        let values = valuesByTest.get(testId);

        if (!values) {
          values = new Map<number, number>();
          valuesByTest.set(testId, values);
        }

        values.set(r.biomarker_id as number, r.value as number);
      }

      const perTest = Array.from(valuesByTest.entries()).map(([testId, valuesBySourceId]) => ({
        sample_taken_at: dateByTestId.get(testId) ?? '',
        valuesBySourceId,
      }));

      return res.json({ history: computeDerivedHistory(target, derivedDefs, gender, perTest) });
    }

    // Direct biomarker: gate to the user's panel, then return stored results.
    if (panelId) {
      const { data: panelEntry } = await supabaseAdmin
        .from('panel_biomarkers')
        .select('biomarker_id')
        .eq('panel_id', panelId)
        .eq('biomarker_id', markerIdNum)
        .maybeSingle();

      if (!panelEntry) {
        return res.json({ history: [] });
      }
    }

    const { data, error } = await supabaseAdmin
      .from('blood_test_results')
      .select(
        `
        value, unit, ref_low, ref_high, flag,
        blood_test:blood_test_id (
          id, sample_taken_at
        )
      `
      )
      .eq('biomarker_id', markerIdNum)
      .in('blood_test_id', testIds)
      .order('blood_test_id', { ascending: true });

    if (error) throw error;

    // Sort by date in JavaScript
    const sorted = (data || []).sort((a, b) => {
      const testA = a.blood_test as unknown as Record<string, unknown> | null;
      const testB = b.blood_test as unknown as Record<string, unknown> | null;
      const dateA = new Date((testA?.sample_taken_at as string) || 0).getTime();
      const dateB = new Date((testB?.sample_taken_at as string) || 0).getTime();

      return dateA - dateB;
    });

    res.json({ history: sorted });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

export const getBiomarkerCategories = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin.from('biomarker_categories').select('*');

    if (error) throw error;

    res.json({ categories: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

// Admin endpoints
export const getAllBiomarkers = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('biomarkers')
      .select(
        `
        id,
        name,
        display_name,
        unit,
        kind,
        formula,
        ref_male_min,
        ref_male_max,
        ref_female_min,
        ref_female_max,
        performance_male_min,
        performance_male_max,
        performance_female_min,
        performance_female_max,
        is_active,
        biomarker_content (
          what_it_measures,
          why_relevant,
          interpretation,
          optimization_tips,
          scientific_sources,
          how_to_optimize
        ),
        category:category_id (
          id,
          name
        ),
        panels:panel_biomarkers (
          panel_id,
          panel:panel_id (
            id,
            name,
            code
          )
        ),
        dependencies:biomarker_dependencies!biomarker_dependencies_derived_id_fkey (
          source_id,
          role,
          sort_order,
          source:source_id (id, name, display_name, unit)
        )
      `
      )
      .order('name', { ascending: true });

    if (error) throw error;

    // Flatten biomarker_content into each biomarker and ensure arrays have default values
    const biomarkers = (data || []).map((b) => {
      const rawContent = b.biomarker_content;
      const content =
        ((Array.isArray(rawContent) ? rawContent[0] : rawContent) as Record<string, unknown>) || {};
      const { biomarker_content: _, ...rest } = b;
      const deps = (rest.dependencies as Array<{ sort_order: number }> | null) || [];

      return {
        ...rest,
        dependencies: deps.slice().sort((a, b) => a.sort_order - b.sort_order),
        what_it_measures: content.what_it_measures || null,
        why_relevant: content.why_relevant || null,
        interpretation: content.interpretation || null,
        optimization_tips: (content.optimization_tips as string[]) || [],
        scientific_sources:
          (content.scientific_sources as Array<{ title: string; url: string }>) || [],
        how_to_optimize: content.how_to_optimize || null,
      };
    });

    res.json({ biomarkers });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

export const createBiomarker = async (req: Request, res: Response) => {
  try {
    const {
      name,
      display_name,
      category_id,
      unit,
      kind,
      formula,
      dependencies,
      ref_male_min,
      ref_male_max,
      ref_female_min,
      ref_female_max,
      performance_male_min,
      performance_male_max,
      performance_female_min,
      performance_female_max,
      is_active = true,
      what_it_measures,
      why_relevant,
      interpretation,
      optimization_tips,
      scientific_sources,
      how_to_optimize,
    } = req.body;

    // Validate required fields
    if (!name || !display_name || !category_id) {
      return res.status(400).json({
        error: 'Missing required fields: name, display_name, and category_id are required',
      });
    }

    const normalizedKind = normalizeKind(kind);

    // Insert biomarker (without content fields)
    const { data, error } = await supabaseAdmin
      .from('biomarkers')
      .insert({
        name,
        display_name,
        category_id,
        unit: unit || null,
        kind: normalizedKind,
        formula: formula || null,
        ref_male_min: ref_male_min || null,
        ref_male_max: ref_male_max || null,
        ref_female_min: ref_female_min || null,
        ref_female_max: ref_female_max || null,
        performance_male_min: performance_male_min || null,
        performance_male_max: performance_male_max || null,
        performance_female_min: performance_female_min || null,
        performance_female_max: performance_female_max || null,
        is_active,
      })
      .select(
        `
        id,
        name,
        display_name,
        unit,
        kind,
        formula,
        ref_male_min,
        ref_male_max,
        ref_female_min,
        ref_female_max,
        performance_male_min,
        performance_male_max,
        performance_female_min,
        performance_female_max,
        is_active,
        category:category_id (
          id,
          name
        )
      `
      )
      .single();

    if (error) throw error;

    if (normalizedKind !== 'direct' && Array.isArray(dependencies)) {
      await syncDependencies(data.id, dependencies as DependencyInput[]);
    }

    // Insert content into biomarker_content table
    const contentPayload = {
      biomarker_id: data.id,
      what_it_measures: what_it_measures || null,
      why_relevant: why_relevant || null,
      interpretation: interpretation || null,
      optimization_tips: optimization_tips || [],
      scientific_sources: scientific_sources || [],
      how_to_optimize: how_to_optimize || null,
    };

    await supabaseAdmin.from('biomarker_content').insert(contentPayload);

    res.status(201).json({
      biomarker: {
        ...data,
        ...contentPayload,
        biomarker_id: undefined,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

export const updateBiomarker = async (req: Request, res: Response) => {
  try {
    const { biomarkerId } = req.params;
    const {
      name,
      display_name,
      category_id,
      unit,
      kind,
      formula,
      dependencies,
      ref_male_min,
      ref_male_max,
      ref_female_min,
      ref_female_max,
      performance_male_min,
      performance_male_max,
      performance_female_min,
      performance_female_max,
      is_active,
      what_it_measures,
      why_relevant,
      interpretation,
      optimization_tips,
      scientific_sources,
      how_to_optimize,
    } = req.body;

    // Build update object for biomarkers table (only non-content fields)
    const updateData: Record<string, unknown> = {};

    if (name !== undefined) updateData.name = name;
    if (display_name !== undefined) updateData.display_name = display_name;
    if (category_id !== undefined) updateData.category_id = category_id;
    if (unit !== undefined) updateData.unit = unit;
    if (kind !== undefined) updateData.kind = normalizeKind(kind);
    if (formula !== undefined) updateData.formula = formula || null;
    if (ref_male_min !== undefined) updateData.ref_male_min = ref_male_min;
    if (ref_male_max !== undefined) updateData.ref_male_max = ref_male_max;
    if (ref_female_min !== undefined) updateData.ref_female_min = ref_female_min;
    if (ref_female_max !== undefined) updateData.ref_female_max = ref_female_max;
    if (performance_male_min !== undefined) updateData.performance_male_min = performance_male_min;
    if (performance_male_max !== undefined) updateData.performance_male_max = performance_male_max;
    if (performance_female_min !== undefined)
      updateData.performance_female_min = performance_female_min;
    if (performance_female_max !== undefined)
      updateData.performance_female_max = performance_female_max;
    if (is_active !== undefined) updateData.is_active = is_active;

    // Update biomarkers table if there are non-content fields to update
    if (Object.keys(updateData).length > 0) {
      const { error } = await supabaseAdmin
        .from('biomarkers')
        .update(updateData)
        .eq('id', biomarkerId);

      if (error) throw error;
    }

    if (Array.isArray(dependencies)) {
      await syncDependencies(Number(biomarkerId), dependencies as DependencyInput[]);
    }

    // Build content update for biomarker_content table
    const contentData: Record<string, unknown> = {};

    if (what_it_measures !== undefined) contentData.what_it_measures = what_it_measures;
    if (why_relevant !== undefined) contentData.why_relevant = why_relevant;
    if (interpretation !== undefined) contentData.interpretation = interpretation;
    if (optimization_tips !== undefined) contentData.optimization_tips = optimization_tips;
    if (scientific_sources !== undefined) contentData.scientific_sources = scientific_sources;
    if (how_to_optimize !== undefined) contentData.how_to_optimize = how_to_optimize;

    // Upsert content if there are content fields to update
    if (Object.keys(contentData).length > 0) {
      const { error: contentError } = await supabaseAdmin
        .from('biomarker_content')
        .upsert(
          { biomarker_id: Number(biomarkerId), ...contentData },
          { onConflict: 'biomarker_id' }
        );

      if (contentError) throw contentError;
    }

    // Fetch the updated biomarker with content
    const { data, error: fetchError } = await supabaseAdmin
      .from('biomarkers')
      .select(
        `
        id,
        name,
        display_name,
        unit,
        kind,
        formula,
        ref_male_min,
        ref_male_max,
        ref_female_min,
        ref_female_max,
        performance_male_min,
        performance_male_max,
        performance_female_min,
        performance_female_max,
        is_active,
        biomarker_content (
          what_it_measures,
          why_relevant,
          interpretation,
          optimization_tips,
          scientific_sources,
          how_to_optimize
        ),
        category:category_id (
          id,
          name
        ),
        dependencies:biomarker_dependencies!biomarker_dependencies_derived_id_fkey (
          source_id,
          role,
          sort_order,
          source:source_id (id, name, display_name, unit)
        )
      `
      )
      .eq('id', biomarkerId)
      .single();

    if (fetchError) throw fetchError;

    // Flatten biomarker_content
    const rawContent = data.biomarker_content;
    const content =
      ((Array.isArray(rawContent) ? rawContent[0] : rawContent) as Record<string, unknown>) || {};
    const { biomarker_content: _, ...rest } = data;
    const sortedDeps = ((rest.dependencies as Array<{ sort_order: number }> | null) || [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order);

    res.json({
      biomarker: {
        ...rest,
        dependencies: sortedDeps,
        what_it_measures: content.what_it_measures || null,
        why_relevant: content.why_relevant || null,
        interpretation: content.interpretation || null,
        optimization_tips: (content.optimization_tips as string[]) || [],
        scientific_sources:
          (content.scientific_sources as Array<{ title: string; url: string }>) || [],
        how_to_optimize: content.how_to_optimize || null,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

export const deleteBiomarker = async (req: Request, res: Response) => {
  try {
    const { biomarkerId } = req.params;

    const { error } = await supabaseAdmin.from('biomarkers').delete().eq('id', biomarkerId);

    if (error) throw error;

    res.json({ message: 'Biomarker deleted successfully' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};
