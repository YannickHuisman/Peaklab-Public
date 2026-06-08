import type { Request, Response } from 'express';

import { supabase } from '../../helpers/supabaseClient';

export const getPanelsWithBiomarkers = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('panels').select(`
        id,
        name,
        code,
        panel_biomarkers (
          sort_order,
          biomarker:biomarker_id (
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
            category:category_id (name)
          )
        )
      `);

    if (error) throw error;

    res.json({ panels: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

export const updateBiomarkerPanels = async (req: Request, res: Response) => {
  try {
    const { biomarkerId } = req.params;
    const { panelIds } = req.body; // array of panel IDs

    if (!Array.isArray(panelIds)) {
      return res.status(400).json({ error: 'panelIds must be an array' });
    }

    // Delete existing panel associations
    const { error: deleteError } = await supabase
      .from('panel_biomarkers')
      .delete()
      .eq('biomarker_id', biomarkerId);

    if (deleteError) throw deleteError;

    // Insert new panel associations
    if (panelIds.length > 0) {
      const insertData = panelIds.map((panelId, index) => ({
        panel_id: panelId,
        biomarker_id: Number(biomarkerId),
        sort_order: index,
        is_primary: true,
      }));

      const { error: insertError } = await supabase.from('panel_biomarkers').insert(insertData);

      if (insertError) throw insertError;
    }

    res.json({ message: 'Panel associations updated successfully' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

export const getBiomarkerPanels = async (req: Request, res: Response) => {
  try {
    const { biomarkerId } = req.params;

    const { data, error } = await supabase
      .from('panel_biomarkers')
      .select('panel_id, panel:panel_id(id, name, code)')
      .eq('biomarker_id', biomarkerId);

    if (error) throw error;

    res.json({ panels: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};
