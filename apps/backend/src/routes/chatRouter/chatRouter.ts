import { Router } from 'express';

import {
  createConversation,
  deleteConversation,
  getConversations,
  getMessages,
  renameConversation,
  saveMessages,
} from '../../controllers/chatController';
import { requireAuth } from '../../middlewares/auth';

const chatRouter = Router();

chatRouter.get('/conversations', requireAuth, getConversations);
chatRouter.post('/conversations', requireAuth, createConversation);
chatRouter.patch('/conversations/:id', requireAuth, renameConversation);
chatRouter.delete('/conversations/:id', requireAuth, deleteConversation);
chatRouter.get('/conversations/:id/messages', requireAuth, getMessages);
chatRouter.post('/conversations/:id/messages', requireAuth, saveMessages);

export default chatRouter;
