import { Router } from 'express';

import {
  createLab,
  deleteLab,
  deleteLabReference,
  getLabs,
  getLabWithReferences,
  updateLab,
  upsertLabReferences,
} from '../../controllers/labController';
import { requireAdmin, requireAuth } from '../../middlewares/auth';
import { requireActiveSubscription } from '../../middlewares/subscription';

const router = Router();

router.get('/', requireAuth, requireActiveSubscription, getLabs);
router.get('/:labId', requireAuth, requireActiveSubscription, getLabWithReferences);

router.post('/admin', requireAuth, requireAdmin, createLab);
router.put('/admin/:labId', requireAuth, requireAdmin, updateLab);
router.delete('/admin/:labId', requireAuth, requireAdmin, deleteLab);
router.post('/admin/:labId/references', requireAuth, requireAdmin, upsertLabReferences);
router.delete('/admin/references/:referenceId', requireAuth, requireAdmin, deleteLabReference);

export default router;
