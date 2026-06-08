import { Router } from 'express';

import {
  createAchievement,
  deleteAchievement,
  getMyAchievements,
} from '../../controllers/achievementController';
import { requireAuth } from '../../middlewares/auth';

const router = Router();

router.get('/', requireAuth, getMyAchievements);
router.post('/', requireAuth, createAchievement);
router.delete('/:achievementId', requireAuth, deleteAchievement);

export default router;
