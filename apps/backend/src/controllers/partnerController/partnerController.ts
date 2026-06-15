import type { Request, Response } from 'express';

import type { DutchRegion, PartnerType, TrainerSpecialization } from '@package/types';

import { supabaseAdmin } from '../../helpers/supabaseClient';

interface GetPartnersQuery {
  type?: PartnerType;
  region?: DutchRegion;
  specialization?: TrainerSpecialization;
  gender?: 'male' | 'female' | 'other';
  featured?: 'true' | 'false';
}

/**
 * Get all partners with optional filtering
 */
export const getPartners = async (req: Request, res: Response) => {
  try {
    const { type, region, specialization, gender, featured } = req.query as GetPartnersQuery;

    let query = supabaseAdmin
      .from('partners')
      .select('*')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('sort_order', { ascending: true })
      .order('rating', { ascending: false, nullsFirst: false });

    // Apply filters
    if (type) {
      query = query.eq('type', type);
    }

    if (region) {
      query = query.eq('region', region);
    }

    if (specialization) {
      query = query.contains('specializations', [specialization]);
    }

    if (gender) {
      query = query.eq('gender', gender);
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({ partners: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

/**
 * Create a new partner
 */
export const createPartner = async (req: Request, res: Response) => {
  try {
    const partnerData = req.body;

    const { data, error } = await supabaseAdmin
      .from('partners')
      .insert(partnerData)
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ partner: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

/**
 * Update an existing partner
 */
export const updatePartner = async (req: Request, res: Response) => {
  try {
    const { partnerId } = req.params;
    const partnerData = req.body;

    const { data, error } = await supabaseAdmin
      .from('partners')
      .update(partnerData)
      .eq('id', partnerId)
      .select()
      .single();

    if (error) throw error;

    res.json({ partner: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

/**
 * Delete a partner (soft delete)
 */
export const deletePartner = async (req: Request, res: Response) => {
  try {
    const { partnerId } = req.params;

    const { error } = await supabaseAdmin
      .from('partners')
      .update({ is_active: false })
      .eq('id', partnerId);

    if (error) throw error;

    res.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};
