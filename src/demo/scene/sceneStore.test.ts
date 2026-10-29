import { describe, expect, it } from 'vitest';
import { createSceneStore, findObject, selectedObjects } from './sceneStore';
import type { SceneStore } from './sceneStore';

function names(store: SceneStore): string[] {
  return store.getState().objects.map(({ name }) => name);
}

function idOf(store: SceneStore, name: string): string {
  return store.getState().objects.find((object) => object.name === name)?.id ?? '';
}

describe('createSceneStore', () => {
  it('starts with a hierarchy of objects', () => {
    const store = createSceneStore();
    const player = idOf(store, 'Player');

    expect(names(store).slice(0, 3)).toEqual(['Main Camera', 'Directional Light', 'Environment']);
    expect(findObject(store.getState(), idOf(store, 'Weapon'))?.parentId).toBe(player);
    expect(findObject(store.getState(), player)?.parentId).toBeNull();
  });

  it('gives every object its own id, also to created ones', () => {
    const store = createSceneStore();
    const created = store.getState().createId();
    const ids = [...store.getState().objects.map(({ id }) => id), created];

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('selects several objects in the scene order', () => {
    const store = createSceneStore();
    store.getState().setSelection([idOf(store, 'Player'), idOf(store, 'Main Camera')]);

    expect(selectedObjects(store.getState()).map(({ name }) => name)).toEqual([
      'Main Camera',
      'Player',
    ]);
  });

  it('updates one object and leaves the others', () => {
    const store = createSceneStore();
    const [camera, light] = store.getState().objects;
    store.getState().updateObject(camera?.id ?? '', (object) => ({ ...object, name: 'Camera' }));

    expect(names(store)[0]).toBe('Camera');
    expect(store.getState().objects[1]).toBe(light);
  });

  it('restores a snapshot of the objects and the selection', () => {
    const store = createSceneStore();
    const [camera] = store.getState().objects;

    store.getState().restore({ objects: camera === undefined ? [] : [camera], selectedIds: ['x'] });

    expect(names(store)).toEqual(['Main Camera']);
    expect(store.getState().selectedIds).toEqual(['x']);
  });
});
