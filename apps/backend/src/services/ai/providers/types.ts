import type { Response } from 'express';

export type AIProviderName = 'openai' | 'mistral';

export interface CompletionConfig {
  model?: string;
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface DeepResearchConfig {
  prompt: string;
}

export interface AIProvider {
  name: AIProviderName;
  streamCompletion(config: CompletionConfig, res: Response): Promise<void>;
  jsonCompletion<T>(config: CompletionConfig): Promise<T>;
  deepResearchCompletion(config: DeepResearchConfig): Promise<string>;
}
