import { Router } from 'express';

import { getDashboard } from '../../controllers/dashboardController';
import { requireAuth } from '../../middlewares/auth';
import { requireActiveSubscription } from '../../middlewares/subscription';

const router = Router();

router.get('/', requireAuth, requireActiveSubscription, getDashboard);

export default router;
