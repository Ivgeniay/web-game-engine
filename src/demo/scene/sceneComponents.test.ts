import { describe, expect, it } from 'vitest';
import { hasComponent, removeComponent, resetComponent } from './sceneComponents';
import { DEFAULT_LIGHT, DEFAULT_RIGIDBODY, DEFAULT_TRANSFORM } from './sceneStore';
import type { SceneObject } from './sceneStore';

const MOVED = { ...DEFAULT_TRANSFORM, position: [1, 2, 3] };
const HEAVY = { ...DEFAULT_RIGIDBODY, mass: 50 };

function object(id: string, rigidbody: SceneObject['rigidbody']): SceneObject {
  return { id, name: id, parentId: null, transform: MOVED, rigidbody, light: null };
}

const SNAPSHOT = {
  objects: [object('a', HEAVY), object('b', HEAVY), object('c', null)],
  selectedIds: ['a', 'c'],
};

describe('scene components', () => {
  it('resets a component only on the given objects that have it', () => {
    const result = resetComponent(SNAPSHOT, ['a', 'c'], 'rigidbody');

    expect(result.objects.map(({ rigidbody }) => rigidbody)).toEqual([
      DEFAULT_RIGIDBODY,
      HEAVY,
      null,
    ]);
    expect(resetComponent(SNAPSHOT, ['a'], 'transform').objects[0]?.transform).toBe(
      DEFAULT_TRANSFORM,
    );
    expect(resetComponent(SNAPSHOT, ['c'], 'light').objects[2]?.light).toBeNull();
  });

  it('removes a component and never removes the transform', () => {
    const result = removeComponent(SNAPSHOT, ['a', 'b'], 'rigidbody');

    expect(result.objects.map((item) => hasComponent(item, 'rigidbody'))).toEqual([
      false,
      false,
      false,
    ]);
    expect(removeComponent(SNAPSHOT, ['a'], 'transform').objects[0]?.transform).toBe(MOVED);
    expect(result.selectedIds).toEqual(SNAPSHOT.selectedIds);
  });

  it('tells which objects have a component', () => {
    const lit = { ...object('d', null), light: DEFAULT_LIGHT };

    expect(hasComponent(lit, 'light')).toBe(true);
    expect(hasComponent(lit, 'transform')).toBe(true);
    expect(hasComponent(lit, 'rigidbody')).toBe(false);
  });
});
