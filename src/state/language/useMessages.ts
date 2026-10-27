import { useCallback } from 'react';
import type { Messages, SourceMessages } from '@/core/i18n/messages';
import { translate } from '@/core/i18n/translate';
import type { Translator } from '@/core/i18n/translate';
import { useLanguageStore } from './useLanguageStore';

export function useMessages<S extends SourceMessages>(messages: Messages<S>): Translator<S> {
  const language = useLanguageStore((state) => state.language);

  return useCallback<Translator<S>>(
    (key, ...args) => translate(messages, language, key, ...args),
    [messages, language],
  );
}
