import { Router } from 'express';

import {
  getPerformanceProfile,
  savePerformanceProfile,
} from '../../controllers/performanceProfileController';
import { requireAuth } from '../../middlewares/auth';

const router = Router();

router.get('/profile', requireAuth, getPerformanceProfile);
router.post('/profile', requireAuth, savePerformanceProfile);

export default router;
