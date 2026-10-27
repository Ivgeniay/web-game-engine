import { useCallback } from 'react';
import { translateRef } from '@/core/i18n/translate';
import type { MessageRef } from '@/core/i18n/translate';
import { useLanguageStore } from './useLanguageStore';

export type RefTranslator = (ref: MessageRef) => string;

export function useTranslate(): RefTranslator {
  const language = useLanguageStore((state) => state.language);

  return useCallback<RefTranslator>((ref) => translateRef(ref, language), [language]);
}
