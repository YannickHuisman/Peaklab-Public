import { Router } from 'express';
import multer from 'multer';

import {
  getAllUploads,
  getUploadSignedUrl,
  getUserUploads,
  getUserUploadSignedUrl,
  updateUploadStatus,
  uploadBloodResult,
} from '../../controllers/uploadController';
import { requireAdmin, requireAuth } from '../../middlewares/auth';
import { requireActiveSubscription } from '../../middlewares/subscription';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// User routes
router.post('/', requireAuth, requireActiveSubscription, upload.single('file'), uploadBloodResult);
router.get('/my-uploads', requireAuth, requireActiveSubscription, getUserUploads);
router.get('/:uploadId/signed-url', requireAuth, requireActiveSubscription, getUserUploadSignedUrl);

// Admin routes
router.get('/admin/all', requireAuth, requireAdmin, getAllUploads);
router.get('/admin/:uploadId/signed-url', requireAuth, requireAdmin, getUploadSignedUrl);
router.put('/admin/:uploadId/status', requireAuth, requireAdmin, updateUploadStatus);

export default router;
