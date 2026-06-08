import { Router } from 'express';

import {
  getAllUsers,
  getMe,
  getProfile,
  loginUser,
  logoutUser,
  registerUser,
  updateUserRole,
} from '../../controllers/authController';
import { requireAdmin, requireAuth } from '../../middlewares/auth';

const authRouter: Router = Router();

authRouter.post('/login', loginUser);
authRouter.post('/register', registerUser);
authRouter.post('/logout', logoutUser);

authRouter.get('/profile', requireAuth, getProfile);
authRouter.get('/me', requireAuth, getMe);

// Admin-only routes for user management
authRouter.get('/admin/users', requireAuth, requireAdmin, getAllUsers);
authRouter.put('/admin/users/role', requireAuth, requireAdmin, updateUserRole);

export default authRouter;
