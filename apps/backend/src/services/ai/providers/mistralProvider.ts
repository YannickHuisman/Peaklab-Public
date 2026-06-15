import { Mistral } from '@mistralai/mistralai';
import type { Response } from 'express';

import { DEEP_RESEARCH_INSTRUCTIONS, DEEP_RESEARCH_TIMEOUT_MS } from './prompts';
import type { AIProvider, CompletionConfig, DeepResearchConfig } from './types';

if (!process.env.MISTRAL_API_KEY) {
  console.warn('[AI] MISTRAL_API_KEY is not set — Mistral provider will not work');
}

const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY ?? '' });

const CHAT_MODEL = 'mistral-small-latest';
const JSON_MODEL = 'mistral-large-latest';
const DEEP_RESEARCH_MODEL = 'mistral-large-latest';

async function streamCompletion(config: CompletionConfig, res: Response): Promise<void> {
  const { systemPrompt, userPrompt, conversationHistory } = config;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: systemPrompt },
  ];

  if (Array.isArray(conversationHistory)) {
    for (const msg of conversationHistory.slice(-20)) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        messages.push({ role: msg.role, content: msg.content });
      }
    }
  }

  messages.push({ role: 'user', content: userPrompt });

  const stream = await mistral.chat.stream({ model: CHAT_MODEL, messages });

  for await (const event of stream) {
    const delta = event.data.choices[0]?.delta?.content;
    const text = typeof delta === 'string' ? delta : '';

    if (text) {
      res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`);
    }
  }

  res.write('data: [DONE]\n\n');
  res.end();
}

async function jsonCompletion<T>(config: CompletionConfig): Promise<T> {
  const { systemPrompt, userPrompt, maxTokens = 3000 } = config;

  const response = await mistral.chat.complete({
    model: JSON_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    maxTokens,
    responseFormat: { type: 'json_object' },
  });

  const content = response.choices?.[0]?.message?.content;
  const text = typeof content === 'string' ? content : '{}';

  return JSON.parse(text) as T;
}

async function deepResearchCompletion(config: DeepResearchConfig): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEEP_RESEARCH_TIMEOUT_MS);

  try {
    const response = await mistral.chat.complete(
      {
        model: DEEP_RESEARCH_MODEL,
        messages: [
          { role: 'system', content: DEEP_RESEARCH_INSTRUCTIONS },
          { role: 'user', content: config.prompt },
        ],
        maxTokens: 8000,
      },
      { fetchOptions: { signal: controller.signal } }
    );

    const content = response.choices?.[0]?.message?.content;
    const text = typeof content === 'string' ? content : '';

    if (!text) throw new Error('Mistral deep research returned no assistant message');

    return text;
  } catch (err) {
    if (controller.signal.aborted) {
      throw new Error(`Mistral deep research timed out after ${DEEP_RESEARCH_TIMEOUT_MS / 1000}s`);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export const mistralProvider: AIProvider = {
  name: 'mistral',
  streamCompletion,
  jsonCompletion,
  deepResearchCompletion,
};
