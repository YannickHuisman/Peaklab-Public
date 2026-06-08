import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { AUTH_COOKIE_NAMES } from '../../helpers/authCookie';
import type { AuthenticatedRequest } from '../../types';

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Missing SUPABASE_JWT_SECRET environment variable');
}

interface SupabaseJwtPayload {
  sub: string;
  email?: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
  role?: string;
}

function readToken(req: Request): string | null {
  const cookieToken = req.cookies?.[AUTH_COOKIE_NAMES.access];

  if (cookieToken) return cookieToken;

  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice('Bearer '.length);
  }

  return null;
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = readToken(req);

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as SupabaseJwtPayload;

    const user: AuthenticatedRequest['user'] = { id: payload.sub };

    if (payload.email) user.email = payload.email;
    if (payload.app_metadata) user.app_metadata = payload.app_metadata;

    (req as AuthenticatedRequest).user = user;

    next();
  } catch {
    return res.status(401).json({ error: 'Not authenticated' });
  }
};
