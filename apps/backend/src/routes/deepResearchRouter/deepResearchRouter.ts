import { Router } from 'express';

import {
  generateDeepResearch,
  getDeepResearch,
  getDeepResearchById,
} from '../../controllers/deepResearchController';
import { requireAuth } from '../../middlewares/auth';

const router = Router();

router.post('/generate', requireAuth, generateDeepResearch);
router.get('/', requireAuth, getDeepResearch);
router.get('/:id', requireAuth, getDeepResearchById);

export default router;
