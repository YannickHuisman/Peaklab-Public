import type { NextFunction, Request, Response } from 'express';

import { isEntitled } from '../../helpers/subscriptionAccess';
import { supabaseAdmin } from '../../helpers/supabaseClient';
import type { AuthenticatedRequest } from '../../types';

/**
 * Server-side paywall. Must run AFTER `requireAuth` (it reuses `req.user`, so it
 * adds a single indexed DB lookup and no extra auth round-trip).
 *
 * Returns 402 Payment Required — deliberately NOT 401, because the client treats
 * 401 as "session expired" and force-logs-out. 402 lets the React paywall handle
 * it gracefully.
 *
 * Staff (admin / super_admin) bypass the gate so internal accounts and support
 * can always reach the app.
 */
export const requireActiveSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as AuthenticatedRequest).user;

  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const role = user.app_metadata?.role;

  if (role === 'admin' || role === 'super_admin') {
    return next();
  }

  const { data: sub, error } = await supabaseAdmin
    .from('subscriptions')
    .select('status, current_period_end')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!isEntitled(sub)) {
    return res
      .status(402)
      .json({ error: 'Active subscription required', code: 'subscription_required' });
  }

  next();
};
