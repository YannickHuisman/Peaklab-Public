import { Router } from 'express';

import { getUserSettings, updateUserSettings } from '../../controllers/settingsController';
import { requireAuth } from '../../middlewares/auth';

const router = Router();

router.get('/', requireAuth, getUserSettings);
router.put('/', requireAuth, updateUserSettings);

export default router;
