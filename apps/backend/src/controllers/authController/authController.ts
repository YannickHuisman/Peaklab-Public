import type { Request, Response } from 'express';

import { clearAuthCookies, setAuthCookies } from '../../helpers/authCookie';
import { supabase } from '../../helpers/supabaseClient';
import type { AuthenticatedRequest } from '../../types';

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });

      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      res.status(401).json({ error: error.message });

      return;
    }

    const accessToken = data.session?.access_token;

    if (!accessToken) {
      res.status(500).json({ error: 'Login succeeded but no session was returned' });

      return;
    }

    setAuthCookies(res, accessToken, data.session?.refresh_token);

    res.json({ user: data.user });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });

      return;
    }

    if (password.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters' });

      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      res.status(400).json({ error: error.message });

      return;
    }

    res.status(201).json({
      user: data.user,
      message: 'User registered successfully. Check email for verification.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

export const logoutUser = async (_req: Request, res: Response): Promise<void> => {
  try {
    clearAuthCookies(res);
    await supabase.auth.signOut();

    res.json({ message: 'Logged out successfully' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user } = req as AuthenticatedRequest;
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();

    if (error) throw error;

    res.json({
      profile: { ...data, role: user.app_metadata?.role || 'user' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user } = req as AuthenticatedRequest;
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();

    if (error) throw error;

    res.json({
      user,
      profile: { ...data, role: user.app_metadata?.role || 'user' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};
