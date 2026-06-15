import { Router } from 'express';
import multer from 'multer';

import {
  approveApplication,
  denyApplication,
  getApplicationById,
  getApplications,
  submitApplication,
  uploadPartnerImage,
} from '../../controllers/partnerApplicationController';
import { requireAdmin, requireAuth } from '../../middlewares/auth';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// Public routes (no auth — external partners submit applications)
router.post('/upload-image', upload.single('file'), uploadPartnerImage);
router.post('/', submitApplication);

// Admin routes
router.get('/admin', requireAuth, requireAdmin, getApplications);
router.get('/admin/:id', requireAuth, requireAdmin, getApplicationById);
router.put('/admin/:id/approve', requireAuth, requireAdmin, approveApplication);
router.put('/admin/:id/deny', requireAuth, requireAdmin, denyApplication);

export default router;
