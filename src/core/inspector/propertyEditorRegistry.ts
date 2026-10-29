import type { ComponentType } from 'react';
import type { PropertyEditorProps, PropertyType } from '@/contracts/property';
import { createRegistry } from '@/core/registry/registry';
import type { Unsubscribe } from '@/core/unsubscribe';

export type PropertyTypeEditor<T> = ComponentType<PropertyEditorProps<T>>;

interface RegisteredEditor {
  readonly type: PropertyType<unknown>;
  readonly editor: unknown;
}

export interface PropertyEditorRegistry {
  readonly register: <T>(type: PropertyType<T>, editor: PropertyTypeEditor<T>) => Unsubscribe;
  readonly get: <T>(type: PropertyType<T>) => PropertyTypeEditor<T> | undefined;
  readonly getSnapshot: () => readonly unknown[];
  readonly subscribe: (listener: () => void) => Unsubscribe;
}

export function createPropertyEditorRegistry(): PropertyEditorRegistry {
  const registry = createRegistry<RegisteredEditor>({
    kind: 'property editor',
    getId: (entry) => entry.type.id,
  });

  return {
    register: (type, editor) => registry.register({ type, editor }),
    get<T>(type: PropertyType<T>) {
      const entry = registry.get(type.id);

      if (entry?.type !== type) {
        return undefined;
      }

      return entry.editor as PropertyTypeEditor<T>;
    },
    getSnapshot: registry.getSnapshot,
    subscribe: registry.subscribe,
  };
}
