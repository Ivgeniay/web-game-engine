import type { MessageRef } from '@/core/i18n/translate';
import type { UndoStack } from '@/core/undo/undoStack';
import type { SceneSnapshot } from './sceneHierarchy';
import { sceneSnapshot } from './sceneStore';
import type { SceneObject, SceneObjectContent, SceneStore } from './sceneStore';

export type SceneEdit = (snapshot: SceneSnapshot) => SceneSnapshot;

export function applySceneEdit(
  scene: SceneStore,
  undo: UndoStack,
  label: MessageRef,
  edit: SceneEdit,
): void {
  const before = sceneSnapshot(scene.getState());
  const after = edit(before);

  if (after === before) {
    return;
  }

  scene.getState().restore(after);
  undo.push({
    label,
    undo: () => {
      scene.getState().restore(before);
    },
    redo: () => {
      scene.getState().restore(after);
    },
  });
}

export function addObject(content: SceneObjectContent, id: string): SceneEdit {
  const object: SceneObject = { ...content, id, parentId: null };

  return ({ objects }) => ({ objects: [...objects, object], selectedIds: [id] });
}

export function renameObject(id: string, name: string): SceneEdit {
  return ({ objects, selectedIds }) => ({
    objects: objects.map((object) => (object.id === id ? { ...object, name } : object)),
    selectedIds,
  });
}
