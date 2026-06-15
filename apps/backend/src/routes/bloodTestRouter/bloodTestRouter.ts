import { Router } from 'express';

import { getUserBloodTests } from '../../controllers/bloodTestController';
import { requireAuth } from '../../middlewares/auth';
import { requireActiveSubscription } from '../../middlewares/subscription';

const router = Router();

router.get('/', requireAuth, requireActiveSubscription, getUserBloodTests);

export default router;
