import { useCallback, useEffect, useState } from 'react';

import { authenticatedFetch } from '../../utils/authenticatedFetch';

export type AIProviderName = 'openai' | 'mistral';

export function useSystemConfig() {
  const [provider, setProvider] = useState<AIProviderName | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProvider = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await authenticatedFetch('/api/system-config/ai-provider');

      if (!res.ok) throw new Error('Failed to fetch AI provider');

      const data = (await res.json()) as { provider: AIProviderName };

      setProvider(data.provider);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProvider();
  }, [fetchProvider]);

  const updateProvider = useCallback(async (next: AIProviderName) => {
    setSaving(true);
    setError(null);

    try {
      const res = await authenticatedFetch('/api/system-config/ai-provider', {
        method: 'PUT',
        body: JSON.stringify({ provider: next }),
      });

      if (!res.ok) throw new Error('Failed to update AI provider');

      setProvider(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSaving(false);
    }
  }, []);

  return { provider, loading, saving, error, updateProvider };
}
