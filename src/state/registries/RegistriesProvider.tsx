import type { ReactNode } from 'react';
import type { EditorRegistries } from './editorRegistries';
import { RegistriesContext } from './registriesContext';

interface RegistriesProviderProps {
  readonly registries: EditorRegistries;
  readonly children: ReactNode;
}

export function RegistriesProvider({ registries, children }: RegistriesProviderProps) {
  return <RegistriesContext value={registries}>{children}</RegistriesContext>;
}
