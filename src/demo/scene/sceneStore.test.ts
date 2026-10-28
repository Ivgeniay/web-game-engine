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
});
