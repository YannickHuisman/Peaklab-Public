import { Router } from 'express';

import {
  createBiomarker,
  deleteBiomarker,
  getAllBiomarkers,
  getBiomarkerCategories,
  getBiomarkerHistory,
  updateBiomarker,
} from '../../controllers/biomarkerController';
import { requireAdmin, requireAuth } from '../../middlewares/auth';

const router = Router();

router.get('/history/:markerId', requireAuth, getBiomarkerHistory);
router.get('/categories', requireAuth, getBiomarkerCategories);

router.get('/admin/all', requireAuth, requireAdmin, getAllBiomarkers);
router.post('/admin', requireAuth, requireAdmin, createBiomarker);
router.put('/admin/:biomarkerId', requireAuth, requireAdmin, updateBiomarker);
router.delete('/admin/:biomarkerId', requireAuth, requireAdmin, deleteBiomarker);

export default router;
