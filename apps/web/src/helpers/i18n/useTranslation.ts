import { useCallback } from 'react';

import { useSettings } from '../../context/SettingsProvider';
import type { SupportedLanguage } from './translations';
import { translate } from './translations';

export function useTranslation() {
  const { settings } = useSettings();
  const lang = (settings.language === 'en' ? 'en' : 'nl') as SupportedLanguage;

  const t = useCallback((text: string): string => translate(text, lang), [lang]);

  return { t, language: lang };
}
