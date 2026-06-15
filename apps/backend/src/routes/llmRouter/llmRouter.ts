import { Router } from 'express';

import { chatWithLLM } from '../../controllers/llmController/llmController';
import { requireAuth } from '../../middlewares/auth';
import { requireActiveSubscription } from '../../middlewares/subscription';

const llmRouter = Router();

llmRouter.post('/chat', requireAuth, requireActiveSubscription, chatWithLLM);

export default llmRouter;
