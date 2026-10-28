import { createContext, useContext } from 'react';
import type { EditorRegistries } from './editorRegistries';

export const RegistriesContext = createContext<EditorRegistries | null>(null);

export function useEditorRegistries(): EditorRegistries {
  const registries = useContext(RegistriesContext);

  if (registries === null) {
    throw new Error('Editor registries are not provided. Wrap the tree in RegistriesProvider.');
  }

  return registries;
}
