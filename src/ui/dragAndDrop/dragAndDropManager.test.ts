import { describe, expect, it, vi } from 'vitest';
import { createDragAndDropManager } from './dragAndDropManager';
import type { DragPoint, DropTargetHandlers } from './dragData';

const ASSET_TYPE = 'asset';
const NODE_TYPE = 'node';
const DATA = { type: ASSET_TYPE, ids: ['texture'], label: 'Texture' };
const OVER_LEFT: DragPoint = { clientX: 10, clientY: 10 };
const OVER_RIGHT: DragPoint = { clientX: 200, clientY: 10 };
const OUTSIDE: DragPoint = { clientX: 500, clientY: 500 };
const LEFT_ID = 'left';
const RIGHT_ID = 'right';
const RIGHT_EDGE = 100;
const OUTSIDE_EDGE = 400;

function findTarget({ clientX }: DragPoint): string | null {
  if (clientX >= OUTSIDE_EDGE) {
    return null;
  }

  return clientX < RIGHT_EDGE ? LEFT_ID : RIGHT_ID;
}

function createTarget(accepts: readonly string[], allowed = true) {
  const handlers = {
    accepts,
    onDragOver: vi.fn((): boolean => allowed),
    onDragLeave: vi.fn(),
    onDrop: vi.fn(),
  } satisfies DropTargetHandlers;

  return handlers;
}

function setup() {
  const manager = createDragAndDropManager(findTarget);
  const left = createTarget([ASSET_TYPE]);
  const right = createTarget([NODE_TYPE]);
  manager.registerTarget(LEFT_ID, () => left);
  manager.registerTarget(RIGHT_ID, () => right);

  return { manager, left, right };
}

describe('createDragAndDropManager', () => {
  it('asks the target under the point and drops the data there', () => {
    const { manager, left } = setup();

    manager.start(DATA, OVER_LEFT);

    expect(left.onDragOver).toHaveBeenCalledWith(DATA, OVER_LEFT);
    expect(manager.getSession()).toEqual({
      data: DATA,
      point: OVER_LEFT,
      targetId: LEFT_ID,
      allowed: true,
    });

    manager.drop();

    expect(left.onDrop).toHaveBeenCalledExactlyOnceWith(DATA, OVER_LEFT);
    expect(left.onDragLeave).toHaveBeenCalledOnce();
    expect(manager.getSession()).toBeNull();
  });

  it('does not ask a target that does not accept the type', () => {
    const { manager, right } = setup();

    manager.start(DATA, OVER_RIGHT);
    manager.drop();

    expect(right.onDragOver).not.toHaveBeenCalled();
    expect(right.onDrop).not.toHaveBeenCalled();
    expect(manager.getSession()).toBeNull();
  });

  it('does not drop where the target refuses', () => {
    const manager = createDragAndDropManager(findTarget);
    const refusing = createTarget([ASSET_TYPE], false);
    manager.registerTarget(LEFT_ID, () => refusing);

    manager.start(DATA, OVER_LEFT);

    expect(manager.getSession()?.allowed).toBe(false);

    manager.drop();

    expect(refusing.onDrop).not.toHaveBeenCalled();
  });

  it('tells the previous target when the pointer leaves it', () => {
    const { manager, left } = setup();

    manager.start(DATA, OVER_LEFT);
    manager.move(OUTSIDE);

    expect(left.onDragLeave).toHaveBeenCalledOnce();
    expect(manager.getSession()).toMatchObject({ targetId: null, allowed: false });
  });

  it('asks the target again for the same point on refresh', () => {
    const { manager, left } = setup();

    manager.start(DATA, OVER_LEFT);
    manager.refresh();

    expect(left.onDragOver).toHaveBeenCalledTimes(2);
    expect(left.onDragLeave).not.toHaveBeenCalled();
  });

  it('cancels without dropping', () => {
    const { manager, left } = setup();

    manager.start(DATA, OVER_LEFT);
    manager.cancel();

    expect(left.onDrop).not.toHaveBeenCalled();
    expect(left.onDragLeave).toHaveBeenCalledOnce();
    expect(manager.getSession()).toBeNull();
  });

  it('forgets a target that is removed during the drag', () => {
    const manager = createDragAndDropManager(findTarget);
    const left = createTarget([ASSET_TYPE]);
    const unregister = manager.registerTarget(LEFT_ID, () => left);

    manager.start(DATA, OVER_LEFT);
    unregister();
    manager.drop();

    expect(left.onDrop).not.toHaveBeenCalled();
  });

  it('notifies the subscribers about every change', () => {
    const { manager } = setup();
    const listener = vi.fn();
    const unsubscribe = manager.subscribe(listener);

    manager.start(DATA, OVER_LEFT);
    manager.move(OVER_RIGHT);
    manager.drop();
    unsubscribe();
    manager.start(DATA, OVER_LEFT);

    expect(listener).toHaveBeenCalledTimes(3);
  });
});
