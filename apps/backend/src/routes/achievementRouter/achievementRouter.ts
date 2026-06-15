import { Router } from 'express';

import {
  createAchievement,
  deleteAchievement,
  getMyAchievements,
} from '../../controllers/achievementController';
import { requireAuth } from '../../middlewares/auth';
import { requireActiveSubscription } from '../../middlewares/subscription';

const router = Router();

router.use(requireAuth, requireActiveSubscription);

router.get('/', getMyAchievements);
router.post('/', createAchievement);
router.delete('/:achievementId', deleteAchievement);

export default router;
