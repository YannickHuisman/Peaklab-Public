import type { NextFunction, Request, Response } from 'express';

import type { AuthenticatedRequest } from '../../types';

export const requireSuperAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req as AuthenticatedRequest;

  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  // Check role from app_metadata (set by Supabase Admin API only)
  const role = user.app_metadata?.role;

  if (role !== 'super_admin') {
    return res.status(403).json({ error: 'Forbidden: Super Admin access required' });
  }

  next();
};
