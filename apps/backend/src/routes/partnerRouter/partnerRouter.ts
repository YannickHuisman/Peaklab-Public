import { Router } from 'express';

import {
  createPartner,
  deletePartner,
  getPartners,
  updatePartner,
} from '../../controllers/partnerController';
import { requireAdmin, requireAuth } from '../../middlewares/auth';
import { requireActiveSubscription } from '../../middlewares/subscription';

const router = Router();

router.get('/', requireAuth, requireActiveSubscription, getPartners);

router.post('/admin', requireAuth, requireAdmin, createPartner);
router.put('/admin/:partnerId', requireAuth, requireAdmin, updatePartner);
router.delete('/admin/:partnerId', requireAuth, requireAdmin, deletePartner);

export default router;
