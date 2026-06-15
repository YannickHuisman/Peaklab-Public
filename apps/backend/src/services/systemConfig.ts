import { supabaseAdmin } from '../helpers/supabaseClient';
import type { AIProviderName } from './ai/providers/types';

const CACHE_TTL_MS = 60_000;

let cache: { provider: AIProviderName; expiresAt: number } | null = null;

function isValidProvider(value: unknown): value is AIProviderName {
  return value === 'openai' || value === 'mistral';
}

export async function getAIProvider(): Promise<AIProviderName> {
  if (cache && cache.expiresAt > Date.now()) return cache.provider;

  const { data } = await supabaseAdmin
    .from('system_config')
    .select('value')
    .eq('key', 'ai_provider')
    .maybeSingle();

  const raw = (data as { value?: unknown } | null)?.value;
  const provider = isValidProvider(raw) ? raw : 'mistral';

  cache = { provider, expiresAt: Date.now() + CACHE_TTL_MS };

  return provider;
}

export async function setAIProvider(provider: AIProviderName, userId: string): Promise<void> {
  const { error } = await supabaseAdmin.from('system_config').upsert(
    {
      key: 'ai_provider',
      value: provider,
      updated_at: new Date().toISOString(),
      updated_by: userId,
    },
    { onConflict: 'key' }
  );

  if (error) throw error;

  cache = { provider, expiresAt: Date.now() + CACHE_TTL_MS };
}

export function invalidateSystemConfigCache(): void {
  cache = null;
}
