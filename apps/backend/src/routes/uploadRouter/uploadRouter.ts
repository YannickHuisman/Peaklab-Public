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

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// User routes
router.post('/', requireAuth, upload.single('file'), uploadBloodResult);
router.get('/my-uploads', requireAuth, getUserUploads);
router.get('/:uploadId/signed-url', requireAuth, getUserUploadSignedUrl);

// Admin routes
router.get('/admin/all', requireAuth, requireAdmin, getAllUploads);
router.get('/admin/:uploadId/signed-url', requireAuth, requireAdmin, getUploadSignedUrl);
router.put('/admin/:uploadId/status', requireAuth, requireAdmin, updateUploadStatus);

export default router;
