import { Router } from 'express';

import { chatWithLLM } from '../../controllers/llmController/llmController';
import { requireAuth } from '../../middlewares/auth';

const llmRouter = Router();

llmRouter.post('/chat', requireAuth, chatWithLLM);

export default llmRouter;
