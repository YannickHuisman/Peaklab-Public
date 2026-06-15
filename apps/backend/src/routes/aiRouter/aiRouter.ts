import { Router } from 'express';

import { generateTrainingSchema, getTrainingSchemaJobStatus } from '../../controllers/aiController';
import { requireAuth } from '../../middlewares/auth';
import { requireActiveSubscription } from '../../middlewares/subscription';

const router = Router();

router.post('/training-schema', requireAuth, requireActiveSubscription, generateTrainingSchema);
router.get(
  '/training-schema/:jobId',
  requireAuth,
  requireActiveSubscription,
  getTrainingSchemaJobStatus
);

export default router;
