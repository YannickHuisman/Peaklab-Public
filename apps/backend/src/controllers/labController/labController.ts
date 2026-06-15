import type { Request, Response } from 'express';

import { supabaseAdmin } from '../../helpers/supabaseClient';

// Get all labs
export const getLabs = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('labs')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    res.json({ labs: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

// Get single lab with its biomarker references
export const getLabWithReferences = async (req: Request, res: Response) => {
  try {
    const { labId } = req.params;

    const { data: lab, error: labError } = await supabaseAdmin
      .from('labs')
      .select('*')
      .eq('id', labId)
      .single();

    if (labError) throw labError;

    const { data: references, error: refError } = await supabaseAdmin
      .from('lab_biomarker_references')
      .select(
        `
        id, unit, lab_ref_min, lab_ref_max, ref_male_min, ref_male_max, ref_female_min, ref_female_max, performance_male_min, performance_male_max, performance_female_min, performance_female_max,
        biomarker:biomarker_id (id, name, display_name, category:category_id (id, name))
      `
      )
      .eq('lab_id', labId)
      .order('biomarker_id', { ascending: true });

    if (refError) throw refError;

    res.json({ lab, references });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

// Admin: Create lab
export const createLab = async (req: Request, res: Response) => {
  try {
    const { name, description, website_url } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Lab name is required' });
    }

    const { data, error } = await supabaseAdmin
      .from('labs')
      .insert({ name, description: description || null, website_url: website_url || null })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ lab: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

// Admin: Update lab
export const updateLab = async (req: Request, res: Response) => {
  try {
    const { labId } = req.params;
    const { name, description, website_url, is_active } = req.body;

    const updateData: Record<string, unknown> = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (website_url !== undefined) updateData.website_url = website_url;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data, error } = await supabaseAdmin
      .from('labs')
      .update(updateData)
      .eq('id', labId)
      .select()
      .single();

    if (error) throw error;

    res.json({ lab: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

// Admin: Delete lab
export const deleteLab = async (req: Request, res: Response) => {
  try {
    const { labId } = req.params;

    const { error } = await supabaseAdmin.from('labs').delete().eq('id', labId);

    if (error) throw error;

    res.json({ message: 'Lab deleted successfully' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

// Admin: Upsert biomarker references for a lab
export const upsertLabReferences = async (req: Request, res: Response) => {
  try {
    const { labId } = req.params;
    const { references } = req.body;

    if (!Array.isArray(references)) {
      return res.status(400).json({ error: 'references must be an array' });
    }

    // Validate each reference
    for (const ref of references) {
      if (!ref.biomarker_id || !ref.unit) {
        return res.status(400).json({ error: 'Each reference must have biomarker_id and unit' });
      }
    }

    const labIdNum = parseInt(labId as string, 10);

    // Upsert each reference
    const refsToUpsert = references.map((ref: Record<string, unknown>) => ({
      lab_id: labIdNum,
      biomarker_id: ref.biomarker_id,
      unit: ref.unit,
      lab_ref_min: ref.lab_ref_min ?? null,
      lab_ref_max: ref.lab_ref_max ?? null,
      ref_male_min: ref.ref_male_min ?? null,
      ref_male_max: ref.ref_male_max ?? null,
      ref_female_min: ref.ref_female_min ?? null,
      ref_female_max: ref.ref_female_max ?? null,
      performance_male_min: ref.performance_male_min ?? null,
      performance_male_max: ref.performance_male_max ?? null,
      performance_female_min: ref.performance_female_min ?? null,
      performance_female_max: ref.performance_female_max ?? null,
    }));

    const { data, error } = await supabaseAdmin
      .from('lab_biomarker_references')
      .upsert(refsToUpsert, { onConflict: 'lab_id,biomarker_id' })
      .select(
        `
        id, unit, lab_ref_min, lab_ref_max, ref_male_min, ref_male_max, ref_female_min, ref_female_max, performance_male_min, performance_male_max, performance_female_min, performance_female_max,
        biomarker:biomarker_id (id, name, display_name)
      `
      );

    if (error) throw error;

    res.json({ references: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

// Admin: Delete a specific lab reference
export const deleteLabReference = async (req: Request, res: Response) => {
  try {
    const { referenceId } = req.params;

    const { error } = await supabaseAdmin
      .from('lab_biomarker_references')
      .delete()
      .eq('id', referenceId);

    if (error) throw error;

    res.json({ message: 'Reference deleted successfully' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};
