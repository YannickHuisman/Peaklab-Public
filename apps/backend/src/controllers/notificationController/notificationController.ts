import type { Request, Response } from 'express';

import { supabaseAdmin } from '../../helpers/supabaseClient';
import type { AuthenticatedRequest } from '../../types';

export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;

    const { data, error } = await supabaseAdmin
      .from('user_notifications')
      .select('id, type, title, message, reference_id, is_read, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    res.json({ notifications: data || [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

export const markUserNotificationRead = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const { notificationId } = req.params;

    const { error } = await supabaseAdmin
      .from('user_notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('user_id', user.id);

    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

export const markAllUserNotificationsRead = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;

    const { error } = await supabaseAdmin
      .from('user_notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};
