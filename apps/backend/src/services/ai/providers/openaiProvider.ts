import type { Response } from 'express';
import OpenAI from 'openai';

import { DEEP_RESEARCH_INSTRUCTIONS, DEEP_RESEARCH_TIMEOUT_MS } from './prompts';
import type { AIProvider, CompletionConfig, DeepResearchConfig } from './types';

if (!process.env.OPENAI_API_KEY) {
  console.warn('[AI] OPENAI_API_KEY is not set — OpenAI provider will not work');
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CHAT_MODEL = 'gpt-4o-mini';
const JSON_MODEL = 'gpt-4o';
// const DEEP_RESEARCH_MODEL = 'o3-deep-research';
const DEEP_RESEARCH_MODEL = 'o4-mini';

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

  const stream = openai.chat.completions.stream({ model: CHAT_MODEL, messages });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;

    if (content) {
      res.write(`data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`);
    }
  }

  res.write('data: [DONE]\n\n');
  res.end();
}

async function jsonCompletion<T>(config: CompletionConfig): Promise<T> {
  const { systemPrompt, userPrompt, maxTokens = 3000 } = config;

  const completion = await openai.chat.completions.create({
    model: JSON_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_completion_tokens: maxTokens,
    response_format: { type: 'json_object' },
  });

  return JSON.parse(completion.choices[0]?.message.content || '{}') as T;
}

async function deepResearchCompletion(config: DeepResearchConfig): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEEP_RESEARCH_TIMEOUT_MS);

  try {
    const response = await openai.responses.create(
      {
        model: DEEP_RESEARCH_MODEL,
        instructions: DEEP_RESEARCH_INSTRUCTIONS,
        input: config.prompt,
        tools: [{ type: 'web_search_preview' }],
      },
      { signal: controller.signal }
    );

    return response.output_text;
  } catch (err) {
    if (controller.signal.aborted) {
      throw new Error(`OpenAI deep research timed out after ${DEEP_RESEARCH_TIMEOUT_MS / 1000}s`);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export const openaiProvider: AIProvider = {
  name: 'openai',
  streamCompletion,
  jsonCompletion,
  deepResearchCompletion,
};
