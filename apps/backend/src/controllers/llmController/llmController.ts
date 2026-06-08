import type { Request, Response } from 'express';

import { buildChatSystemPrompt, streamCompletion } from '../../services/ai';

export async function chatWithLLM(req: Request, res: Response) {
  const { message, userContext, conversationHistory } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Message is required' });

    return;
  }

  try {
    const systemPrompt = buildChatSystemPrompt(userContext);

    await streamCompletion(
      {
        systemPrompt,
        userPrompt: message,
        conversationHistory,
      },
      res
    );
  } catch (error) {
    console.error('[LLM] Error:', error instanceof Error ? error.message : error);
    res.status(500).json({
      error: 'Failed to process LLM request',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
