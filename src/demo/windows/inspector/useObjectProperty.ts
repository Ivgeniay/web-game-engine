import type { ValueChangeHandler } from '@/contracts/valueChange';
import type { MessageRef } from '@/core/i18n/translate';
import { useDemoStores } from '@/demo/demoStores';
import { findObject } from '@/demo/scene/sceneStore';
import type { SceneObject } from '@/demo/scene/sceneStore';
import { useUndoableValue } from '@/state/undo/useUndoableValue';

export interface ObjectProperty<T> {
  readonly object: SceneObject;
  readonly label: MessageRef;
  readonly get: (object: SceneObject) => T;
  readonly set: (object: SceneObject, value: T) => SceneObject;
}

export function useObjectProperty<T>({
  object,
  label,
  get,
  set,
}: ObjectProperty<T>): ValueChangeHandler<T> {
  const { scene } = useDemoStores();
  const objectId = object.id;

  return useUndoableValue({
    label,
    read: () => get(findObject(scene.getState(), objectId) ?? object),
    write: (value) => {
      scene.getState().updateObject(objectId, (current) => set(current, value));
    },
  });
}
