import { describe, expect, it } from 'vitest';
import { messageRef } from '@/core/i18n/translate';
import { createUndoStack } from '@/core/undo/undoStack';
import { demoMessages } from '@/demo/demoMessages';
import { deleteObjects } from './sceneHierarchy';
import { addObject, applySceneEdit, renameObject } from './sceneEdits';
import { DEFAULT_TRANSFORM, createSceneStore } from './sceneStore';

const LABEL = messageRef(demoMessages, 'delete');
const NEW_ID = 'new-object';

describe('applySceneEdit', () => {
  it('applies an edit as one undo record that also brings the selection back', () => {
    const scene = createSceneStore();
    const undo = createUndoStack();
    const before = scene.getState().objects;
    const playerId = before.find(({ name }) => name === 'Player')?.id ?? '';
    scene.getState().setSelection([playerId]);

    applySceneEdit(scene, undo, LABEL, (snapshot) => deleteObjects(snapshot, [playerId]));

    expect(scene.getState().objects.map(({ name }) => name)).not.toContain('Weapon');
    expect(scene.getState().selectedIds).toEqual([]);

    undo.undo();

    expect(scene.getState().objects).toBe(before);
    expect(scene.getState().selectedIds).toEqual([playerId]);

    undo.redo();

    expect(scene.getState().objects.map(({ name }) => name)).not.toContain('Player');
  });

  it('does not record an edit that changes nothing', () => {
    const scene = createSceneStore();
    const undo = createUndoStack();

    applySceneEdit(scene, undo, LABEL, (snapshot) => snapshot);

    expect(undo.canUndo()).toBe(false);
  });

  it('adds a root object and selects it', () => {
    const scene = createSceneStore();
    const undo = createUndoStack();
    const content = {
      name: 'Cube',
      transform: DEFAULT_TRANSFORM,
      rigidbody: null,
      light: null,
      path: null,
      note: null,
      meshRenderer: null,
    };

    applySceneEdit(scene, undo, LABEL, addObject(content, NEW_ID));

    expect(scene.getState().objects.at(-1)).toMatchObject({ id: NEW_ID, parentId: null });
    expect(scene.getState().selectedIds).toEqual([NEW_ID]);
  });

  it('renames an object', () => {
    const scene = createSceneStore();
    const undo = createUndoStack();
    const [camera] = scene.getState().objects;

    applySceneEdit(scene, undo, LABEL, renameObject(camera?.id ?? '', 'Camera'));
    undo.undo();

    expect(scene.getState().objects[0]?.name).toBe('Main Camera');
  });
});
