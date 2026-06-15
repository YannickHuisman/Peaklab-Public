import { Router } from 'express';

import {
  createCheckoutSession,
  createPortalSession,
  getPlans,
  getSubscription,
  reconcileSubscriptions,
} from '../../controllers/subscriptionController';
import { requireAuth } from '../../middlewares/auth';

const subscriptionRouter: Router = Router();

subscriptionRouter.get('/', requireAuth, getSubscription);
subscriptionRouter.get('/plans', requireAuth, getPlans);
subscriptionRouter.post('/checkout', requireAuth, createCheckoutSession);
subscriptionRouter.post('/portal', requireAuth, createPortalSession);

// Machine-to-machine drift backstop — auth via the x-cron-secret header inside
// the handler, not requireAuth (the scheduler has no user session).
subscriptionRouter.post('/reconcile', reconcileSubscriptions);

export default subscriptionRouter;

// NOTE: POST /webhook is registered directly in server.ts (it needs the raw
// body, before express.json()).
