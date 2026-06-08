import type { Request, Response } from 'express';

import { supabaseAdmin } from '../../helpers/supabaseClient';
import type { AuthenticatedRequest } from '../../types';

/**
 * Get all appointments (admin only)
 */
export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const { status, userId, from, to } = req.query;

    let query = supabaseAdmin
      .from('appointments')
      .select(
        `
        *,
        user:user_id (
          id,
          full_name,
          username,
          avatar_url
        ),
        creator:created_by (
          id,
          full_name
        )
      `
      )
      .order('scheduled_at', { ascending: true });

    // Apply filters
    if (status) {
      query = query.eq('status', status as string);
    }

    if (userId) {
      query = query.eq('user_id', userId as string);
    }

    if (from) {
      query = query.gte('scheduled_at', from as string);
    }

    if (to) {
      query = query.lte('scheduled_at', to as string);
    }

    const { data: appointments, error } = await query;

    if (error) throw error;

    return res.json({ appointments: appointments || [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    return res.status(500).json({ error: message });
  }
};

/**
 * Get appointments for a specific user (admin only)
 */
export const getUserAppointments = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const { data: appointments, error } = await supabaseAdmin
      .from('appointments')
      .select(
        `
        *,
        creator:created_by (
          id,
          full_name
        )
      `
      )
      .eq('user_id', userId)
      .order('scheduled_at', { ascending: false });

    if (error) throw error;

    return res.json({ appointments: appointments || [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    return res.status(500).json({ error: message });
  }
};

/**
 * Get my appointments (authenticated user)
 */
export const getMyAppointments = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const userId = user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Use supabaseAdmin since we've already authenticated the user via middleware
    // and the regular supabase client doesn't have the user's auth context for RLS
    const { data: appointments, error } = await supabaseAdmin
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .order('scheduled_at', { ascending: true });

    if (error) throw error;

    // Calculate last and next appointment
    const now = new Date();
    const pastAppointments =
      appointments?.filter((a) => new Date(a.scheduled_at) < now && a.status !== 'cancelled') || [];
    const futureAppointments =
      appointments?.filter((a) => new Date(a.scheduled_at) >= now && a.status === 'scheduled') ||
      [];

    const lastAppointment =
      pastAppointments.length > 0 ? pastAppointments[pastAppointments.length - 1] : null;
    const nextAppointment = futureAppointments.length > 0 ? futureAppointments[0] : null;

    return res.json({
      appointments: appointments || [],
      lastAppointment,
      nextAppointment,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    return res.status(500).json({ error: message });
  }
};

/**
 * Create a new appointment (admin only)
 */
export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const adminUserId = user?.id;
    const {
      user_id,
      title,
      description,
      appointment_type,
      scheduled_at,
      duration_minutes,
      location,
      admin_notes,
    } = req.body;

    if (!user_id || !title || !scheduled_at) {
      return res.status(400).json({ error: 'user_id, title, and scheduled_at are required' });
    }

    const { data: appointment, error } = await supabaseAdmin
      .from('appointments')
      .insert({
        user_id,
        title,
        description: description || null,
        appointment_type: appointment_type || 'consultation',
        scheduled_at,
        duration_minutes: duration_minutes || 60,
        location: location || null,
        admin_notes: admin_notes || null,
        created_by: adminUserId,
        status: 'scheduled',
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({ appointment });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    return res.status(500).json({ error: message });
  }
};

/**
 * Update an appointment (admin only)
 */
export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.params;
    const updateData = req.body;

    if (!appointmentId) {
      return res.status(400).json({ error: 'appointmentId is required' });
    }

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.created_at;
    delete updateData.created_by;

    const { data: appointment, error } = await supabaseAdmin
      .from('appointments')
      .update(updateData)
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) throw error;

    return res.json({ appointment });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    return res.status(500).json({ error: message });
  }
};

/**
 * Delete an appointment (admin only)
 */
export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.params;

    if (!appointmentId) {
      return res.status(400).json({ error: 'appointmentId is required' });
    }

    const { error } = await supabaseAdmin.from('appointments').delete().eq('id', appointmentId);

    if (error) throw error;

    return res.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    return res.status(500).json({ error: message });
  }
};
