import { Router } from 'express';

import {
  getPerformanceProfile,
  savePerformanceProfile,
} from '../../controllers/performanceProfileController';
import { requireAuth } from '../../middlewares/auth';
import { requireActiveSubscription } from '../../middlewares/subscription';

const router = Router();

router.get('/profile', requireAuth, requireActiveSubscription, getPerformanceProfile);
router.post('/profile', requireAuth, requireActiveSubscription, savePerformanceProfile);

export default router;
