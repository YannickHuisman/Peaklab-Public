import type { Request, Response } from 'express';

import type { AIProviderName } from '../../services/ai';
import { getAIProvider, setAIProvider } from '../../services/systemConfig';
import type { AuthenticatedRequest } from '../../types';

function isValidProvider(value: unknown): value is AIProviderName {
  return value === 'openai' || value === 'mistral';
}

export const getAIProviderConfig = async (_req: Request, res: Response) => {
  try {
    const provider = await getAIProvider();

    res.json({ provider });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};

export const updateAIProviderConfig = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const { provider } = req.body as { provider?: unknown };

    if (!isValidProvider(provider)) {
      return res.status(400).json({ error: 'Invalid provider — must be "openai" or "mistral"' });
    }

    await setAIProvider(provider, user.id);

    res.json({ provider });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};
