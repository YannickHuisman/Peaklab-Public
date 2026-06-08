import type { Response } from 'express';

import { openai } from './openaiClient';

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

/**
 * Run an OpenAI deep research query using the Responses API with o3-deep-research.
 * This model performs extensive web research and returns a detailed markdown report.
 * Can take 5-15 minutes to complete.
 */
export async function deepResearchCompletion(config: DeepResearchConfig): Promise<string> {
  const response = await openai.responses.create({
    model: 'o3-deep-research',
    input: config.prompt,
    tools: [{ type: 'web_search_preview' }],
  });

  return response.output_text;
}

/**
 * Stream an OpenAI chat completion as Server-Sent Events.
 * Sets SSE headers, iterates the stream, and writes chunks to the response.
 */
export async function streamCompletion(config: CompletionConfig, res: Response): Promise<void> {
  const { model = 'gpt-4o-mini', systemPrompt, userPrompt, conversationHistory } = config;

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Build messages array
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: systemPrompt },
  ];

  // Add conversation history (limit to last 20)
  if (Array.isArray(conversationHistory)) {
    const history = conversationHistory.slice(-20);

    for (const msg of history) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        messages.push({ role: msg.role, content: msg.content });
      }
    }
  }

  messages.push({ role: 'user', content: userPrompt });

  const stream = await openai.chat.completions.stream({
    model,
    messages,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;

    if (content) {
      res.write(
        `data: ${JSON.stringify({
          choices: [{ delta: { content } }],
        })}\n\n`
      );
    }
  }

  res.write('data: [DONE]\n\n');
  res.end();
}

/**
 * Get a JSON-formatted completion from OpenAI.
 * Parses the response and returns the typed result.
 */
export async function jsonCompletion<T>(config: CompletionConfig): Promise<T> {
  const { model = 'gpt-4o-mini', systemPrompt, userPrompt, maxTokens = 3000 } = config;

  const completion = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_completion_tokens: maxTokens,
    response_format: { type: 'json_object' },
  });

  return JSON.parse(completion.choices[0]?.message.content || '{}') as T;
}
