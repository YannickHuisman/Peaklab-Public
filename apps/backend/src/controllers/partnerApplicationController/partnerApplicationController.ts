import type { Request, Response } from 'express';

import { supabaseAdmin } from '../../helpers/supabaseClient';
import type { AuthenticatedRequest } from '../../types';

// NOTE: The following DB migrations are required for full feature support:
//   ALTER TABLE partner_applications ADD COLUMN image_url text DEFAULT NULL;
//   ALTER TABLE partner_applications ADD COLUMN subtitle text DEFAULT NULL;
//   ALTER TABLE partner_applications ADD COLUMN price_from numeric DEFAULT NULL;
//   ALTER TABLE partner_applications ADD COLUMN price_unit text DEFAULT NULL;
//   ALTER TABLE partner_applications ADD COLUMN links jsonb DEFAULT '[]';
//   ALTER TABLE partner_applications ADD COLUMN tags text[] DEFAULT '{}';
//   ALTER TABLE partner_applications ADD COLUMN phone_company text DEFAULT NULL;
//   ALTER TABLE partners ADD COLUMN links jsonb DEFAULT '[]';
//   ALTER TABLE partners ADD COLUMN regions text[] DEFAULT NULL;

const PARTNER_IMAGES_BUCKET = 'partner-images';
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/**
 * Public: Upload a partner image to Supabase Storage.
 * Returns a public URL that can be included in the application.
 */
export const uploadPartnerImage = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Geen bestand meegegeven' });
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return res.status(400).json({ error: 'Bestand te groot. Maximaal 5 MB.' });
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      return res
        .status(400)
        .json({ error: 'Ongeldig bestandstype. Gebruik JPG, PNG, WebP of GIF.' });
    }

    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const timestamp = Date.now();
    const filePath = `applications/${timestamp}-${safeName}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(PARTNER_IMAGES_BUCKET)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(PARTNER_IMAGES_BUCKET).getPublicUrl(filePath);

    res.status(201).json({ imageUrl: publicUrl });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

/**
 * Public: Submit a new partner application (no auth required)
 */
export const submitApplication = async (req: Request, res: Response) => {
  try {
    const {
      contact_name,
      contact_email,
      phone,
      phone_company,
      company_name,
      subtitle,
      type,
      description,
      website_url,
      image_url,
      region,
      regions,
      specializations,
      contact_preference,
      price_from,
      price_unit,
      links,
      tags,
    } = req.body;

    if (!contact_name || !contact_email || !company_name || !type) {
      return res.status(400).json({
        error: 'Vul alle verplichte velden in (naam, e-mail, bedrijfsnaam, type)',
      });
    }

    // Derive website_url from links if not explicitly provided
    const websiteFromLinks = Array.isArray(links)
      ? (links.find((l) => l?.type === 'website' && l?.url)?.url ?? null)
      : null;

    const { data: application, error } = await supabaseAdmin
      .from('partner_applications')
      .insert({
        contact_name,
        contact_email,
        phone: phone || null,
        phone_company: phone_company || null,
        company_name,
        subtitle: subtitle || null,
        type,
        description: description || null,
        website_url: website_url || websiteFromLinks,
        image_url: image_url || null,
        region: Array.isArray(regions) && regions.length > 0 ? regions[0] : region || null,
        regions: Array.isArray(regions) && regions.length > 0 ? regions : null,
        specializations: specializations || [],
        contact_preference: contact_preference || null,
        price_from: price_from !== null ? Number(price_from) : null,
        price_unit: price_unit || null,
        links: Array.isArray(links) && links.length > 0 ? links : null,
        tags: Array.isArray(tags) && tags.length > 0 ? tags : [],
      })
      .select()
      .single();

    if (error) {
      console.error('[partner-applications] insert failed', {
        code: (error as { code?: string }).code,
        message: error.message,
        details: (error as { details?: string }).details,
        hint: (error as { hint?: string }).hint,
      });
      throw error;
    }

    // Admin notification
    await supabaseAdmin.from('admin_notifications').insert({
      type: 'partner_application',
      title: 'Nieuwe partner aanvraag',
      message: `${contact_name} (${company_name}) heeft een partner aanvraag ingediend`,
      reference_id: application.id,
    });

    res.status(201).json({ application });
  } catch (err: unknown) {
    console.error('[partner-applications] submitApplication error', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    const code = (err as { code?: string }).code;
    const details = (err as { details?: string }).details;
    const hint = (err as { hint?: string }).hint;

    res.status(500).json({ error: message, code, details, hint });
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

    const { data: partner, error: partnerError } = await supabaseAdmin
      .from('partners')
      .insert({
        name: application.company_name,
        subtitle: application.subtitle ?? null,
        type: application.type,
        description: application.description,
        website_url: application.website_url,
        image_url: application.image_url,
        region: application.region,
        regions: application.regions ?? null,
        specializations:
          application.specializations?.length > 0 ? application.specializations : null,
        price_from: application.price_from ?? null,
        price_unit: application.price_unit ?? 'sessie',
        links: application.links ?? null,
        is_active: true,
        is_featured: false,
        tags:
          Array.isArray(application.tags) && application.tags.length > 0 ? application.tags : [],
        review_count: 0,
        sort_order: 0,
      })
      .select()
      .single();

    if (partnerError) throw partnerError;

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
