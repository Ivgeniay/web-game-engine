import type { ReactNode } from 'react';
import { LocaleContext } from '@/ui/locale/localeContext';
import { useLanguageStore } from './useLanguageStore';

interface LanguageLocaleProviderProps {
  readonly children: ReactNode;
}

export function LanguageLocaleProvider({ children }: LanguageLocaleProviderProps) {
  const language = useLanguageStore((state) => state.language);

  return <LocaleContext value={language}>{children}</LocaleContext>;
}
