import { useCallback, useEffect, useRef } from 'react';
import type { ValueChangeHandler, ValueChangePhase } from '@/contracts/valueChange';
import type { MessageRef } from '@/core/i18n/translate';
import { sameValue } from '@/core/undo/undoableValue';
import { useDemoStores } from '@/demo/demoStores';
import { findObject } from '@/demo/scene/sceneStore';
import type { SceneObject } from '@/demo/scene/sceneStore';
import { useEditorRegistries } from '@/state/registries/registriesContext';

export interface SelectionPropertyOptions<T> {
  readonly objects: readonly SceneObject[];
  readonly label: MessageRef;
  readonly get: (object: SceneObject) => T;
  readonly set: (object: SceneObject, value: T) => SceneObject;
  readonly merge?: ((own: T, value: T, shown: T) => T) | undefined;
  readonly equals?: ((first: T, second: T) => boolean) | undefined;
}

export interface SelectionProperty<T> {
  readonly value: T;
  readonly mixed: boolean;
  readonly onValueChange: ValueChangeHandler<T>;
}

interface EditStart<T> {
  readonly values: ReadonlyMap<string, T>;
  readonly shown: T;
}

export function useSelectionProperty<T>(
  options: SelectionPropertyOptions<T>,
): SelectionProperty<T> {
  const { scene } = useDemoStores();
  const { undo } = useEditorRegistries();
  const optionsRef = useRef(options);
  const startRef = useRef<EditStart<T> | null>(null);

  useEffect(() => {
    optionsRef.current = options;
  });

  const onValueChange = useCallback(
    (value: T, phase: ValueChangePhase) => {
      const { objects, label, get, set, merge, equals = sameValue } = optionsRef.current;
      const ids = objects.map(({ id }) => id);

      function readAll(): ReadonlyMap<string, T> {
        return new Map(
          ids.flatMap((id) => {
            const object = findObject(scene.getState(), id);

            return object === null ? [] : [[id, get(object)] as const];
          }),
        );
      }

      function writeAll(valueOf: (own: T) => T): void {
        for (const id of ids) {
          scene.getState().updateObject(id, (current) => set(current, valueOf(get(current))));
        }
      }

      function restoreEach(values: ReadonlyMap<string, T>): void {
        for (const id of ids) {
          const stored = values.get(id);

          if (stored !== undefined) {
            scene.getState().updateObject(id, (current) => set(current, stored));
          }
        }
      }

      const [firstObject] = objects;

      if (firstObject === undefined) {
        return;
      }

      const start = startRef.current ?? { values: readAll(), shown: get(firstObject) };
      const apply = (own: T) => (merge === undefined ? value : merge(own, value, start.shown));

      if (phase === 'preview') {
        startRef.current = start;
        writeAll(apply);

        return;
      }

      startRef.current = null;

      if (phase === 'cancel') {
        restoreEach(start.values);

        return;
      }

      writeAll(apply);
      const after = readAll();
      const changed = ids.some((id) => {
        const before = start.values.get(id);
        const now = after.get(id);

        return before === undefined || now === undefined || !equals(before, now);
      });

      if (changed) {
        undo.push({
          label,
          undo: () => {
            restoreEach(start.values);
          },
          redo: () => {
            restoreEach(after);
          },
        });
      }
    },
    [scene, undo],
  );

  const [first, ...others] = options.objects;

  if (first === undefined) {
    throw new Error('A selection property needs at least one object.');
  }

  const equals = options.equals ?? sameValue;
  const value = options.get(first);
  const mixed = others.some((object) => !equals(options.get(object), value));

  return { value, mixed, onValueChange };
}
