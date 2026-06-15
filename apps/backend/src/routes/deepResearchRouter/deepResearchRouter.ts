import { Router } from 'express';

import {
  generateDeepResearch,
  getDeepResearch,
  getDeepResearchById,
} from '../../controllers/deepResearchController';
import { requireAuth } from '../../middlewares/auth';
import { requireActiveSubscription } from '../../middlewares/subscription';

const router = Router();

router.use(requireAuth, requireActiveSubscription);

router.post('/generate', generateDeepResearch);
router.get('/', getDeepResearch);
router.get('/:id', getDeepResearchById);

export default router;
