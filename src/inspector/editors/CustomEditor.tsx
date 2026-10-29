import { createElement, useEffect, useSyncExternalStore } from 'react';
import type { PropertyEditorProps, PropertyType } from '@/contracts/property';
import { useEditorRegistries } from '@/state/registries/registriesContext';
import { reportDevelopmentError } from '@/shared/developmentError';

interface CustomEditorProps extends PropertyEditorProps<unknown> {
  readonly valueType: PropertyType<unknown>;
}

export function CustomEditor({ valueType, ...props }: CustomEditorProps) {
  const { propertyEditors } = useEditorRegistries();
  useSyncExternalStore(propertyEditors.subscribe, propertyEditors.getSnapshot);
  const Editor = propertyEditors.get(valueType);

  useEffect(() => {
    if (Editor === undefined) {
      reportDevelopmentError(`No property editor is registered for type "${valueType.id}".`);
    }
  }, [Editor, valueType]);

  return Editor === undefined ? null : createElement(Editor, props);
}
