import { useContext } from 'react';
import { LocaleContext } from './localeContext';

export function useLocale(): string {
  return useContext(LocaleContext);
}
