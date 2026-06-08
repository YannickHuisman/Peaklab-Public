import { Router } from 'express';

import { getDashboard } from '../../controllers/dashboardController';
import { requireAuth } from '../../middlewares/auth';

const router = Router();

router.get('/', requireAuth, getDashboard);

export default router;
