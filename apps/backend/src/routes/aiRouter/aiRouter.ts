import { Router } from 'express';

import { generateTrainingSchema } from '../../controllers/aiController';
import { requireAuth } from '../../middlewares/auth';

const router = Router();

router.post('/training-schema', requireAuth, generateTrainingSchema);

export default router;
