import { Router } from 'express';

import {
  createAppointment,
  deleteAppointment,
  getAllAppointments,
  getMyAppointments,
  getUserAppointments,
  updateAppointment,
} from '../../controllers/appointmentController';
import { requireAdmin, requireAuth } from '../../middlewares/auth';

const router = Router();

router.get('/my', requireAuth, getMyAppointments);

router.get('/', requireAuth, requireAdmin, getAllAppointments);
router.get('/user/:userId', requireAuth, requireAdmin, getUserAppointments);
router.post('/', requireAuth, requireAdmin, createAppointment);
router.put('/:appointmentId', requireAuth, requireAdmin, updateAppointment);
router.delete('/:appointmentId', requireAuth, requireAdmin, deleteAppointment);

export default router;
