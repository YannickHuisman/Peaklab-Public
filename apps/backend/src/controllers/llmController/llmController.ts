import type { Request, Response } from 'express';

import { getUserAIContextPreferences } from '../../helpers/userAISettings';
import { buildChatSystemPrompt, streamCompletion } from '../../services/ai';
import { buildBiomarkerChatContext } from '../../services/biomarkerData';
import type { AuthenticatedRequest } from '../../types';

export async function chatWithLLM(req: Request, res: Response) {
  const { message, userContext, conversationHistory } = req.body;
  const { user } = req as AuthenticatedRequest;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Message is required' });

    return;
  }

  try {
    const prefs = await getUserAIContextPreferences(user.id);
    const incoming = (userContext ?? {}) as Record<string, unknown>;
    const filtered: Record<string, unknown> = {};

    if (prefs.profile && incoming.profile) filtered.profile = incoming.profile;

    // Biomarkers are always recomputed server-side from the same pipeline the
    // overview / deep research use — never trusted from the client — so the
    // chat can never see a different (or stale) set than the rest of the app.
    if (prefs.biomarkers) {
      const biomarkers = await buildBiomarkerChatContext(user.id);

      if (biomarkers.length > 0) filtered.biomarkers = biomarkers;
    }

    if (prefs.performancePlan && incoming.performancePlan) {
      filtered.performancePlan = incoming.performancePlan;
    }

    const systemPrompt = buildChatSystemPrompt(filtered);

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
