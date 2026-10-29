import type { TreeDropTarget } from '@/ui/treeView/treeDrop';
import type { TreeModel } from '@/ui/treeView/treeModel';
import type { SceneObject } from './sceneStore';

export interface SceneSnapshot {
  readonly objects: readonly SceneObject[];
  readonly selectedIds: readonly string[];
}

export type CreateId = () => string;

export function childIds(objects: readonly SceneObject[], parentId: string | null): string[] {
  return objects.filter((object) => object.parentId === parentId).map(({ id }) => id);
}

export function createSceneTreeModel(objects: readonly SceneObject[]): TreeModel {
  const children = new Map<string | null, string[]>();
  const names = new Map<string, string>();

  for (const object of objects) {
    names.set(object.id, object.name);
    children.set(object.parentId, [...(children.get(object.parentId) ?? []), object.id]);
  }

  return {
    rootIds: children.get(null) ?? [],
    getChildren: (id) => children.get(id) ?? [],
    hasChildren: (id) => children.has(id),
    getLabel: (id) => names.get(id) ?? id,
  };
}

export function withDescendants(
  objects: readonly SceneObject[],
  ids: readonly string[],
): ReadonlySet<string> {
  const result = new Set(ids);
  let grew = true;

  while (grew) {
    grew = false;

    for (const object of objects) {
      if (object.parentId !== null && result.has(object.parentId) && !result.has(object.id)) {
        result.add(object.id);
        grew = true;
      }
    }
  }

  return result;
}

function topmost(objects: readonly SceneObject[], ids: readonly string[]): readonly string[] {
  const selected = new Set(ids);
  const byId = new Map(objects.map((object) => [object.id, object]));

  function hasSelectedAncestor(id: string): boolean {
    let parent = byId.get(id)?.parentId ?? null;

    while (parent !== null) {
      if (selected.has(parent)) {
        return true;
      }

      parent = byId.get(parent)?.parentId ?? null;
    }

    return false;
  }

  return objects
    .filter(({ id }) => selected.has(id) && !hasSelectedAncestor(id))
    .map(({ id }) => id);
}

export function deleteObjects({ objects }: SceneSnapshot, ids: readonly string[]): SceneSnapshot {
  const removed = withDescendants(objects, ids);

  return { objects: objects.filter(({ id }) => !removed.has(id)), selectedIds: [] };
}

export function duplicateObjects(
  { objects }: SceneSnapshot,
  ids: readonly string[],
  createId: CreateId,
): SceneSnapshot {
  const roots = topmost(objects, ids);
  const copied = withDescendants(objects, roots);
  const copyIds = new Map(
    objects.filter(({ id }) => copied.has(id)).map(({ id }) => [id, createId()]),
  );

  function copyOf(object: SceneObject): SceneObject {
    const parentId =
      object.parentId === null ? null : (copyIds.get(object.parentId) ?? object.parentId);

    return { ...object, id: copyIds.get(object.id) ?? object.id, parentId };
  }

  const copies = objects.filter(({ id }) => copied.has(id)).map(copyOf);
  const selectedIds = roots.flatMap((id) => copyIds.get(id) ?? []);

  return { objects: [...objects, ...copies], selectedIds };
}

function parentOfTarget(objects: readonly SceneObject[], target: TreeDropTarget): string | null {
  if (target.kind === 'root') {
    return null;
  }
  if (target.position === 'inside') {
    return target.id;
  }

  return objects.find(({ id }) => id === target.id)?.parentId ?? null;
}

function insertIndex(objects: readonly SceneObject[], target: TreeDropTarget): number {
  if (target.kind === 'root' || target.position === 'inside') {
    return objects.length;
  }

  const index = objects.findIndex(({ id }) => id === target.id);

  return target.position === 'before' ? index : index + 1;
}

export function moveObjects(
  snapshot: SceneSnapshot,
  ids: readonly string[],
  target: TreeDropTarget,
): SceneSnapshot {
  const { objects, selectedIds } = snapshot;
  const moving = new Set(ids);

  if (target.kind === 'node' && target.position !== 'inside' && moving.has(target.id)) {
    return snapshot;
  }

  const byId = new Map(objects.map((object) => [object.id, object]));
  const parentId = parentOfTarget(objects, target);
  const moved = ids.flatMap((id) => {
    const object = byId.get(id);

    return object === undefined ? [] : [{ ...object, parentId }];
  });
  const rest = objects.filter(({ id }) => !moving.has(id));
  const index = insertIndex(rest, target);

  return {
    objects: [...rest.slice(0, index), ...moved, ...rest.slice(index)],
    selectedIds,
  };
}
