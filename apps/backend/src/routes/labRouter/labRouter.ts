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

const router = Router();

router.get('/', requireAuth, getLabs);
router.get('/:labId', requireAuth, getLabWithReferences);

router.post('/admin', requireAuth, requireAdmin, createLab);
router.put('/admin/:labId', requireAuth, requireAdmin, updateLab);
router.delete('/admin/:labId', requireAuth, requireAdmin, deleteLab);
router.post('/admin/:labId/references', requireAuth, requireAdmin, upsertLabReferences);
router.delete('/admin/references/:referenceId', requireAuth, requireAdmin, deleteLabReference);

export default router;
