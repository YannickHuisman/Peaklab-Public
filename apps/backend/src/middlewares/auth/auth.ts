import type { NextFunction, Request, Response } from 'express';

import { AUTH_COOKIE_NAMES } from '../../helpers/authCookie';
import { supabase } from '../../helpers/supabaseClient';
import type { AuthenticatedRequest } from '../../types';

function readToken(req: Request): string | null {
  const cookieToken = req.cookies?.[AUTH_COOKIE_NAMES.access];

  if (cookieToken) return cookieToken;

  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice('Bearer '.length);
  }

  return null;
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = readToken(req);

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    // Validate against Supabase's auth server. This works regardless of the
    // project's JWT signing algorithm — legacy HS256 shared secret or the
    // asymmetric ES256 signing keys that new Supabase projects default to.
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user: AuthenticatedRequest['user'] = { id: data.user.id };

    if (data.user.email) user.email = data.user.email;
    if (data.user.app_metadata) user.app_metadata = data.user.app_metadata;

    (req as AuthenticatedRequest).user = user;

    next();
  } catch {
    return res.status(401).json({ error: 'Not authenticated' });
  }
};
