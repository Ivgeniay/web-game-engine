import { describe, expect, it } from 'vitest';
import { createSceneStore, selectedObject } from './sceneStore';

function names(store: ReturnType<typeof createSceneStore>): string[] {
  return store.getState().objects.map(({ name }) => name);
}

describe('createSceneStore', () => {
  it('creates an object and selects it', () => {
    const store = createSceneStore();
    store.getState().create('Cube');

    expect(names(store).at(-1)).toBe('Cube');
    expect(selectedObject(store.getState())?.name).toBe('Cube');
  });

  it('duplicates and deletes the selected object', () => {
    const store = createSceneStore();
    const [camera] = store.getState().objects;
    store.getState().select(camera?.id ?? '');
    store.getState().duplicateSelected();

    expect(names(store)).toEqual(['Main Camera', 'Directional Light', 'Player', 'Main Camera']);

    store.getState().deleteSelected();

    expect(names(store)).toEqual(['Main Camera', 'Directional Light', 'Player']);
    expect(store.getState().selectedId).toBeNull();
  });

  it('gives every object its own id', () => {
    const store = createSceneStore();
    store.getState().create('Cube');
    store.getState().create('Cube');
    const ids = store.getState().objects.map(({ id }) => id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('updates one object and leaves the others', () => {
    const store = createSceneStore();
    const [camera, light] = store.getState().objects;
    store.getState().updateObject(camera?.id ?? '', (object) => ({ ...object, name: 'Camera' }));

    expect(names(store)).toEqual(['Camera', 'Directional Light', 'Player']);
    expect(store.getState().objects[1]).toBe(light);
  });

  it('ignores an update of a missing object', () => {
    const store = createSceneStore();
    const before = store.getState().objects;
    store.getState().updateObject('missing', (object) => ({ ...object, name: 'Changed' }));

    expect(names(store)).toEqual(before.map(({ name }) => name));
  });

  it('copies the components of a duplicated object', () => {
    const store = createSceneStore();
    const player = store.getState().objects[2];
    store.getState().select(player?.id ?? '');
    store.getState().duplicateSelected();
    const copy = store.getState().objects.at(-1);

    expect(copy?.id).not.toBe(player?.id);
    expect(copy?.rigidbody).toEqual(player?.rigidbody);
    expect(copy?.transform).toEqual(player?.transform);
  });
});
