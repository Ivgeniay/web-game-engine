import type { SceneSnapshot } from './sceneHierarchy';
import { DEFAULT_LIGHT, DEFAULT_RIGIDBODY, DEFAULT_TRANSFORM } from './sceneStore';
import type { SceneObject } from './sceneStore';

export const COMPONENT_KINDS = ['transform', 'rigidbody', 'light'] as const;

export type ComponentKind = (typeof COMPONENT_KINDS)[number];

export const REMOVABLE_COMPONENTS: ReadonlySet<ComponentKind> = new Set(['rigidbody', 'light']);

function resetIn(object: SceneObject, component: ComponentKind): SceneObject {
  switch (component) {
    case 'transform':
      return { ...object, transform: DEFAULT_TRANSFORM };
    case 'rigidbody':
      return object.rigidbody === null ? object : { ...object, rigidbody: DEFAULT_RIGIDBODY };
    case 'light':
      return object.light === null ? object : { ...object, light: DEFAULT_LIGHT };
  }
}

function removeFrom(object: SceneObject, component: ComponentKind): SceneObject {
  switch (component) {
    case 'transform':
      return object;
    case 'rigidbody':
      return { ...object, rigidbody: null };
    case 'light':
      return { ...object, light: null };
  }
}

function editObjects(
  { objects, selectedIds }: SceneSnapshot,
  ids: readonly string[],
  edit: (object: SceneObject) => SceneObject,
): SceneSnapshot {
  const editing = new Set(ids);

  return {
    objects: objects.map((object) => (editing.has(object.id) ? edit(object) : object)),
    selectedIds,
  };
}

export function resetComponent(
  snapshot: SceneSnapshot,
  ids: readonly string[],
  component: ComponentKind,
): SceneSnapshot {
  return editObjects(snapshot, ids, (object) => resetIn(object, component));
}

export function removeComponent(
  snapshot: SceneSnapshot,
  ids: readonly string[],
  component: ComponentKind,
): SceneSnapshot {
  return editObjects(snapshot, ids, (object) => removeFrom(object, component));
}

export function hasComponent(object: SceneObject, component: ComponentKind): boolean {
  switch (component) {
    case 'transform':
      return true;
    case 'rigidbody':
      return object.rigidbody !== null;
    case 'light':
      return object.light !== null;
  }
}
