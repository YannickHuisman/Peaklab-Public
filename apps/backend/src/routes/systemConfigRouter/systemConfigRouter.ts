import { Router } from 'express';

import {
  getAIProviderConfig,
  updateAIProviderConfig,
} from '../../controllers/systemConfigController';
import { requireAdmin, requireAuth } from '../../middlewares/auth';

const router = Router();

router.get('/ai-provider', requireAuth, requireAdmin, getAIProviderConfig);
router.put('/ai-provider', requireAuth, requireAdmin, updateAIProviderConfig);

export default router;
