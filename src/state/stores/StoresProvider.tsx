import type { ReactNode } from 'react';
import { StoresContext } from './storesContext';
import type { EditorStores } from './storesContext';

interface StoresProviderProps {
  readonly stores: EditorStores;
  readonly children: ReactNode;
}

export function StoresProvider({ stores, children }: StoresProviderProps) {
  return <StoresContext value={stores}>{children}</StoresContext>;
}
