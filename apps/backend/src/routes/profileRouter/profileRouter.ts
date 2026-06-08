import { Router } from 'express';
import multer from 'multer';

import {
  deleteAvatar,
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
} from '../../controllers/profileController';
import { requireAuth } from '../../middlewares/auth';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', requireAuth, getUserProfile);
router.put('/', requireAuth, updateUserProfile);
router.post('/avatar', requireAuth, upload.single('avatar'), uploadAvatar);
router.delete('/avatar', requireAuth, deleteAvatar);

export default router;
