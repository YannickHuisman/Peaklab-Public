import { Router } from 'express';

import { getUserBloodTests } from '../../controllers/bloodTestController';
import { requireAuth } from '../../middlewares/auth';

const router = Router();

router.get('/', requireAuth, getUserBloodTests);

export default router;
