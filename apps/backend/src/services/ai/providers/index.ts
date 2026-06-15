import type { Response } from 'express';

import { getAIProvider } from '../../systemConfig';
import { mistralProvider } from './mistralProvider';
import { openaiProvider } from './openaiProvider';
import type { AIProvider, CompletionConfig, DeepResearchConfig } from './types';

export type { AIProvider, AIProviderName, CompletionConfig, DeepResearchConfig } from './types';

async function getActiveProvider(): Promise<AIProvider> {
  const name = await getAIProvider();

  return name === 'openai' ? openaiProvider : mistralProvider;
}

export async function getActiveProviderName(): Promise<string> {
  return getAIProvider();
}

export async function streamCompletion(config: CompletionConfig, res: Response): Promise<void> {
  const provider = await getActiveProvider();

  return provider.streamCompletion(config, res);
}

export async function jsonCompletion<T>(config: CompletionConfig): Promise<T> {
  const provider = await getActiveProvider();

  return provider.jsonCompletion<T>(config);
}

export async function deepResearchCompletion(config: DeepResearchConfig): Promise<string> {
  const provider = await getActiveProvider();

  return provider.deepResearchCompletion(config);
}

export { getActiveProvider, mistralProvider, openaiProvider };
