import { useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Language } from '@/core/i18n/languages';
import type { Messages } from '@/core/i18n/messages';
import { translate } from '@/core/i18n/translate';
import { useLanguageStore } from '@/state/language/useLanguageStore';
import { DocText } from './DocText';
import type { DocMessages, DocSourceMessages } from './docMessages';

export type DocTranslator<K extends string> = (key: K) => ReactNode;

function translateDoc(
  messages: Messages<DocSourceMessages>,
  language: Language,
  key: string,
): string {
  return translate(messages, language, key);
}

export function useDocMessages<K extends string>(messages: DocMessages<K>): DocTranslator<K> {
  const language = useLanguageStore((state) => state.language);

  return useCallback<DocTranslator<K>>(
    (key) => <DocText text={translateDoc(messages, language, key)} />,
    [messages, language],
  );
}
