import type { Request, Response } from 'express';

import { supabaseAdmin } from '../../helpers/supabaseClient';

interface UserProfile {
  id: string;
  full_name?: string;
  username?: string;
  created_at?: string;
}

interface AuthUser {
  id: string;
  email?: string;
  app_metadata?: Record<string, unknown>;
  created_at: string;
  last_sign_in_at?: string;
}

/**
 * Get all users with their roles (Admin only)
 * Uses Supabase Admin API to access user metadata
 */
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();

    if (authError) throw authError;

    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, username, created_at');

    if (profileError) throw profileError;

    const users = authUsers.users.map((authUser: AuthUser) => {
      const profile = (profiles as UserProfile[] | null)?.find((p) => p.id === authUser.id);

      const nameParts = (profile?.full_name || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      return {
        id: authUser.id,
        email: authUser.email,
        role: (authUser.app_metadata?.role as string) || 'user',
        first_name: firstName,
        last_name: lastName,
        username: profile?.username,
        created_at: authUser.created_at,
        last_sign_in: authUser.last_sign_in_at,
      };
    });

    res.json({ users });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

/**
 * Update user role (Admin only)
 * Uses Supabase Admin API to securely update app_metadata
 */
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ error: 'userId and role are required' });
    }

    if (role !== 'user' && role !== 'admin') {
      return res.status(400).json({ error: 'Invalid role. Must be "user" or "admin"' });
    }

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      app_metadata: { role },
    });

    if (error) throw error;

    res.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        role: data.user.app_metadata?.role,
      },
      message: 'User role updated successfully',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};
