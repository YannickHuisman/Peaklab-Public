import { Router } from 'express';

import {
  createUserBloodTest,
  deleteBiomarkerResult,
  deleteUserBloodTest,
  getBloodTestResults,
  getPanelBiomarkers,
  getUserDetails,
  removeUserPanel,
  updateUserPanel,
  updateUserRole,
  upsertBiomarkerResults,
} from '../../controllers/adminUserManagementController';
import { requireAdmin, requireAuth, requireSuperAdmin } from '../../middlewares/auth';

const router = Router();

// User details and management
router.get('/users/:userId', requireAuth, requireAdmin, getUserDetails);
router.put('/users/:userId/role', requireAuth, requireSuperAdmin, updateUserRole);

// Panel management
router.put('/users/:userId/panel', requireAuth, requireAdmin, updateUserPanel);
router.delete('/users/:userId/panel', requireAuth, requireAdmin, removeUserPanel);
router.get('/panels/:panelId/biomarkers', requireAuth, requireAdmin, getPanelBiomarkers);

// Blood test management
router.post('/users/:userId/blood-tests', requireAuth, requireAdmin, createUserBloodTest);
router.delete('/blood-tests/:testId', requireAuth, requireAdmin, deleteUserBloodTest);
router.get('/blood-tests/:testId/results', requireAuth, requireAdmin, getBloodTestResults);

// Biomarker results management
router.post('/blood-tests/:testId/results', requireAuth, requireAdmin, upsertBiomarkerResults);
router.delete('/results/:resultId', requireAuth, requireAdmin, deleteBiomarkerResult);

export default router;
