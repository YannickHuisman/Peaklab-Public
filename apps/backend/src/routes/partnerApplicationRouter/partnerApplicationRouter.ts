import { Router } from 'express';

import {
  approveApplication,
  denyApplication,
  getApplicationById,
  getApplications,
  submitApplication,
} from '../../controllers/partnerApplicationController';
import { requireAdmin, requireAuth } from '../../middlewares/auth';

const router = Router();

// Public route (no auth — external partners submit applications)
router.post('/', submitApplication);

// Admin routes
router.get('/admin', requireAuth, requireAdmin, getApplications);
router.get('/admin/:id', requireAuth, requireAdmin, getApplicationById);
router.put('/admin/:id/approve', requireAuth, requireAdmin, approveApplication);
router.put('/admin/:id/deny', requireAuth, requireAdmin, denyApplication);

export default router;
