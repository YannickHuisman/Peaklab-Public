import type { Request, Response } from 'express';

import { supabaseAdmin } from '../../helpers/supabaseClient';
import type { AuthenticatedRequest } from '../../types';

export const getBiomarkerHistory = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const { markerId } = req.params;

    // First get all blood tests for this user
    const { data: userTests, error: testsError } = await supabaseAdmin
      .from('blood_tests')
      .select('id')
      .eq('user_id', user.id);

    if (testsError) throw testsError;

    const testIds = userTests?.map((t) => t.id) || [];

    if (testIds.length === 0) {
      return res.json({ history: [] });
    }

    // Then get results for this biomarker from those tests
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
      .eq('biomarker_id', markerId)
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

      return {
        ...rest,
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

    // Insert biomarker (without content fields)
    const { data, error } = await supabaseAdmin
      .from('biomarkers')
      .insert({
        name,
        display_name,
        category_id,
        unit: unit || null,
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

    res.json({
      biomarker: {
        ...rest,
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
