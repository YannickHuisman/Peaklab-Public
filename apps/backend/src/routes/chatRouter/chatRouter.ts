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
import { requireActiveSubscription } from '../../middlewares/subscription';

const chatRouter = Router();

// All chat is AI-powered premium content.
chatRouter.use(requireAuth, requireActiveSubscription);

chatRouter.get('/conversations', getConversations);
chatRouter.post('/conversations', createConversation);
chatRouter.patch('/conversations/:id', renameConversation);
chatRouter.delete('/conversations/:id', deleteConversation);
chatRouter.get('/conversations/:id/messages', getMessages);
chatRouter.post('/conversations/:id/messages', saveMessages);

export default chatRouter;
