import { type ReactNode, useCallback, useEffect, useState } from 'react';

import { authenticatedFetch } from '@helpers/authenticatedFetch';

import { useAuth } from '@package/api';

import { DEFAULT_SETTINGS, SettingsContext, type UserSettings } from './SettingsContext';

function applyTheme(themeSetting: string) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = themeSetting === 'dark' || (themeSetting === 'system' && prefersDark);

  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);

      return;
    }

    (async () => {
      try {
        const res = await authenticatedFetch('/api/settings');

        if (res.ok) {
          const json = await res.json();
          const merged = { ...DEFAULT_SETTINGS, ...json.settings };

          setSettings(merged);
          applyTheme(merged.theme);
        }
      } catch {
        // use defaults
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  useEffect(() => {
    if (settings.theme !== 'system') return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');

    mq.addEventListener('change', handler);

    return () => mq.removeEventListener('change', handler);
  }, [settings.theme]);

  const update = useCallback(async (partial: Partial<UserSettings>) => {
    setSettings((prev) => {
      if (partial.theme) {
        applyTheme(partial.theme);
      }

      return { ...prev, ...partial };
    });

    setSaving(true);

    try {
      const res = await authenticatedFetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partial),
      });

      if (res.ok) {
        const json = await res.json();

        setSettings((prev) => ({ ...prev, ...json.settings }));
      }
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, saving, update }}>
      {children}
    </SettingsContext.Provider>
  );
}
