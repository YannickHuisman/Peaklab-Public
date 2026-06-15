import { Router } from 'express';

import {
  getUserNotifications,
  markAllUserNotificationsRead,
  markUserNotificationRead,
} from '../../controllers/notificationController';
import {
  getAdminNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../controllers/uploadController';
import { requireAdmin, requireAuth } from '../../middlewares/auth';

const router = Router();

// User notifications
router.get('/', requireAuth, getUserNotifications);
router.put('/:notificationId/read', requireAuth, markUserNotificationRead);
router.put('/read-all', requireAuth, markAllUserNotificationsRead);

// Admin notifications
router.get('/admin', requireAuth, requireAdmin, getAdminNotifications);
router.put('/admin/:notificationId/read', requireAuth, requireAdmin, markNotificationRead);
router.put('/admin/read-all', requireAuth, requireAdmin, markAllNotificationsRead);

export default router;
