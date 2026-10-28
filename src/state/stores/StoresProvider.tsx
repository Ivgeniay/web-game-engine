import type { ReactNode } from 'react';
import { LanguageLocaleProvider } from '@/state/language/LanguageLocaleProvider';
import { StoresContext } from './storesContext';
import type { EditorStores } from './storesContext';

interface StoresProviderProps {
  readonly stores: EditorStores;
  readonly children: ReactNode;
}

export function StoresProvider({ stores, children }: StoresProviderProps) {
  return (
    <StoresContext value={stores}>
      <LanguageLocaleProvider>{children}</LanguageLocaleProvider>
    </StoresContext>
  );
}
