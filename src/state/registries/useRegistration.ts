import { useEffect, useEffectEvent, useRef } from 'react';
import type { DependencyList } from 'react';
import type { Unsubscribe } from '@/core/unsubscribe';
import type { EditorRegistries } from './editorRegistries';
import { useEditorRegistries } from './registriesContext';

export type Registration = (editor: EditorRegistries) => Unsubscribe;

interface ActiveRegistration {
  readonly editor: EditorRegistries;
  readonly dependencies: DependencyList;
  readonly unsubscribe: Unsubscribe;
}

function sameDependencies(previous: DependencyList, next: DependencyList): boolean {
  return (
    previous.length === next.length &&
    previous.every((dependency, index) => Object.is(dependency, next[index]))
  );
}

export function useRegistration(register: Registration, dependencies: DependencyList): void {
  const editor = useEditorRegistries();
  const registerLatest = useEffectEvent(register);
  const active = useRef<ActiveRegistration | null>(null);

  useEffect(() => {
    const current = active.current;

    if (
      current !== null &&
      current.editor === editor &&
      sameDependencies(current.dependencies, dependencies)
    ) {
      return;
    }

    current?.unsubscribe();
    active.current = { editor, dependencies, unsubscribe: registerLatest(editor) };
  });

  useEffect(
    () => () => {
      active.current?.unsubscribe();
      active.current = null;
    },
    [],
  );
}
