import { Router } from 'express';

import {
  getBiomarkerPanels,
  getPanelsWithBiomarkers,
  updateBiomarkerPanels,
} from '../../controllers/panelController';
import { requireAdmin, requireAuth } from '../../middlewares/auth';

const router = Router();

router.get('/', requireAuth, getPanelsWithBiomarkers);
router.get('/biomarker/:biomarkerId', requireAuth, requireAdmin, getBiomarkerPanels);
router.put('/biomarker/:biomarkerId', requireAuth, requireAdmin, updateBiomarkerPanels);

export default router;
