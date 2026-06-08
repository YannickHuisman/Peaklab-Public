import type { Request, Response } from 'express';

import { supabaseAdmin } from '../../helpers/supabaseClient';
import type { AuthenticatedRequest } from '../../types';

/**
 * Public: Submit a new partner application (no auth required)
 */
export const submitApplication = async (req: Request, res: Response) => {
  try {
    const {
      contact_name,
      contact_email,
      phone,
      company_name,
      type,
      description,
      website_url,
      region,
      specializations,
      motivation,
    } = req.body;

    if (!contact_name || !contact_email || !company_name || !type) {
      return res.status(400).json({
        error: 'Vul alle verplichte velden in (naam, e-mail, bedrijfsnaam, type)',
      });
    }

    const { data: application, error } = await supabaseAdmin
      .from('partner_applications')
      .insert({
        contact_name,
        contact_email,
        phone: phone || null,
        company_name,
        type,
        description: description || null,
        website_url: website_url || null,
        region: region || null,
        specializations: specializations || [],
        motivation: motivation || null,
      })
      .select()
      .single();

    if (error) throw error;

    // Create admin notification
    await supabaseAdmin.from('admin_notifications').insert({
      type: 'partner_application',
      title: 'Nieuwe partner aanvraag',
      message: `${contact_name} (${company_name}) heeft een partner aanvraag ingediend`,
      reference_id: application.id,
    });

    res.status(201).json({ application });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

/**
 * Admin: Get all partner applications with optional status filter
 */
export const getApplications = async (req: Request, res: Response) => {
  try {
    const { status } = req.query as { status?: string };

    let query = supabaseAdmin
      .from('partner_applications')
      .select(
        `
        *,
        reviewer:reviewed_by (id, full_name)
      `
      )
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({ applications: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

/**
 * Admin: Get a single partner application by ID
 */
export const getApplicationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('partner_applications')
      .select(
        `
        *,
        reviewer:reviewed_by (id, full_name)
      `
      )
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'Aanvraag niet gevonden' });
    }

    res.json({ application: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

/**
 * Admin: Approve a partner application — creates a partner entry automatically
 */
export const approveApplication = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const { id } = req.params;
    const { admin_notes } = req.body;

    // Get the application
    const { data: application, error: fetchError } = await supabaseAdmin
      .from('partner_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    if (!application) {
      return res.status(404).json({ error: 'Aanvraag niet gevonden' });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ error: 'Aanvraag is al beoordeeld' });
    }

    // Create partner from application data
    const { data: partner, error: partnerError } = await supabaseAdmin
      .from('partners')
      .insert({
        name: application.company_name,
        type: application.type,
        description: application.description,
        website_url: application.website_url,
        region: application.region,
        specializations:
          application.specializations?.length > 0 ? application.specializations : null,
        is_active: true,
        is_featured: false,
        tags: [],
        review_count: 0,
        sort_order: 0,
      })
      .select()
      .single();

    if (partnerError) throw partnerError;

    // Update application status
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('partner_applications')
      .update({
        status: 'approved',
        admin_notes: admin_notes || null,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        partner_id: partner.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(
        `
        *,
        reviewer:reviewed_by (id, full_name)
      `
      )
      .single();

    if (updateError) throw updateError;

    res.json({ application: updated, partner });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

/**
 * Admin: Deny a partner application
 */
export const denyApplication = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const { id } = req.params;
    const { admin_notes } = req.body;

    // Check current status
    const { data: application, error: fetchError } = await supabaseAdmin
      .from('partner_applications')
      .select('status')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    if (!application) {
      return res.status(404).json({ error: 'Aanvraag niet gevonden' });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ error: 'Aanvraag is al beoordeeld' });
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('partner_applications')
      .update({
        status: 'denied',
        admin_notes: admin_notes || null,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(
        `
        *,
        reviewer:reviewed_by (id, full_name)
      `
      )
      .single();

    if (updateError) throw updateError;

    res.json({ application: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};
