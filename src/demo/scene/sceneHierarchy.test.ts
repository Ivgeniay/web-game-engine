import { describe, expect, it } from 'vitest';
import {
  createSceneTreeModel,
  deleteObjects,
  duplicateObjects,
  moveObjects,
  withDescendants,
} from './sceneHierarchy';
import type { SceneSnapshot } from './sceneHierarchy';
import { DEFAULT_TRANSFORM } from './sceneStore';
import type { SceneObject } from './sceneStore';

function node(id: string, parentId: string | null = null): SceneObject {
  return {
    id,
    name: id.toUpperCase(),
    parentId,
    transform: DEFAULT_TRANSFORM,
    rigidbody: null,
    light: null,
    path: null,
    note: null,
  };
}

const SCENE: SceneSnapshot = {
  objects: [node('a'), node('b'), node('b1', 'b'), node('b2', 'b'), node('b21', 'b2'), node('c')],
  selectedIds: ['b'],
};

function structure({ objects }: SceneSnapshot): readonly string[] {
  return objects.map(({ id, parentId }) => `${id}:${parentId ?? '-'}`);
}

function sequentialIds(): () => string {
  let next = 0;

  return () => {
    next += 1;

    return `copy-${String(next)}`;
  };
}

describe('createSceneTreeModel', () => {
  it('reads the roots, the children in the scene order and the names', () => {
    const model = createSceneTreeModel(SCENE.objects);

    expect(model.rootIds).toEqual(['a', 'b', 'c']);
    expect(model.getChildren('b')).toEqual(['b1', 'b2']);
    expect(model.hasChildren('b2')).toBe(true);
    expect(model.hasChildren('a')).toBe(false);
    expect(model.getLabel('b21')).toBe('B21');
  });
});

describe('withDescendants', () => {
  it('adds every descendant at any depth', () => {
    expect([...withDescendants(SCENE.objects, ['b'])].sort()).toEqual(['b', 'b1', 'b2', 'b21']);
  });
});

describe('deleteObjects', () => {
  it('removes the objects with their descendants and clears the selection', () => {
    const result = deleteObjects(SCENE, ['b2', 'c']);

    expect(result.objects.map(({ id }) => id)).toEqual(['a', 'b', 'b1']);
    expect(result.selectedIds).toEqual([]);
  });
});

describe('duplicateObjects', () => {
  it('copies the topmost objects with their subtrees and selects the copies', () => {
    const result = duplicateObjects(SCENE, ['b2', 'b21', 'a'], sequentialIds());
    const copies = result.objects.slice(SCENE.objects.length);

    expect(copies.map(({ name, parentId }) => `${name}:${parentId ?? '-'}`)).toEqual([
      'A:-',
      'B2:b',
      'B21:copy-2',
    ]);
    expect(result.selectedIds).toEqual(['copy-1', 'copy-2']);
  });
});

describe('moveObjects', () => {
  it('moves objects inside a node as its last children', () => {
    const result = moveObjects(SCENE, ['a', 'c'], { kind: 'node', id: 'b2', position: 'inside' });

    expect(createSceneTreeModel(result.objects).getChildren('b2')).toEqual(['b21', 'a', 'c']);
    expect(result.selectedIds).toEqual(SCENE.selectedIds);
  });

  it('moves an object before or after a sibling of another parent', () => {
    const before = moveObjects(SCENE, ['c'], { kind: 'node', id: 'b1', position: 'before' });
    const after = moveObjects(SCENE, ['a'], { kind: 'node', id: 'b1', position: 'after' });

    expect(createSceneTreeModel(before.objects).getChildren('b')).toEqual(['c', 'b1', 'b2']);
    expect(createSceneTreeModel(after.objects).getChildren('b')).toEqual(['b1', 'a', 'b2']);
  });

  it('moves objects to the end of the roots and keeps their subtrees', () => {
    const result = moveObjects(SCENE, ['b2'], { kind: 'root' });
    const model = createSceneTreeModel(result.objects);

    expect(model.rootIds).toEqual(['a', 'b', 'c', 'b2']);
    expect(model.getChildren('b2')).toEqual(['b21']);
  });

  it('keeps the order in which the tree passes the objects', () => {
    const result = moveObjects(SCENE, ['c', 'a'], { kind: 'node', id: 'b1', position: 'inside' });

    expect(createSceneTreeModel(result.objects).getChildren('b1')).toEqual(['c', 'a']);
  });

  it('changes nothing when an object is dropped next to itself', () => {
    expect(moveObjects(SCENE, ['a'], { kind: 'node', id: 'a', position: 'after' })).toBe(SCENE);
  });

  it('leaves the other objects as they are', () => {
    const result = moveObjects(SCENE, ['c'], { kind: 'node', id: 'a', position: 'inside' });

    expect(structure(result)).toEqual(['a:-', 'b:-', 'b1:b', 'b2:b', 'b21:b2', 'c:a']);
  });
});
