import { Router } from 'express';

import {
  getBiomarkerPanels,
  getPanelsWithBiomarkers,
  getPublicPanels,
  updateBiomarkerPanels,
} from '../../controllers/panelController';
import { requireAdmin, requireAuth } from '../../middlewares/auth';
import { requireActiveSubscription } from '../../middlewares/subscription';

const router = Router();

router.get('/public', getPublicPanels);
router.get('/', requireAuth, requireActiveSubscription, getPanelsWithBiomarkers);
router.get('/biomarker/:biomarkerId', requireAuth, requireAdmin, getBiomarkerPanels);
router.put('/biomarker/:biomarkerId', requireAuth, requireAdmin, updateBiomarkerPanels);

export default router;
