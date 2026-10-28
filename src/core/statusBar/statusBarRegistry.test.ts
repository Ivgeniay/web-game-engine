import { describe, expect, it, vi } from 'vitest';
import { createStatusBarRegistry, statusBarZoneItems } from './statusBarRegistry';
import type { StatusBarItem, StatusBarZone } from './statusBarRegistry';

function SceneName() {
  return null;
}

function item(id: string, zone: StatusBarZone, order: number): StatusBarItem {
  return { id, zone, order, component: SceneName };
}

describe('createStatusBarRegistry', () => {
  it('registers and removes items and notifies subscribers', () => {
    const registry = createStatusBarRegistry();
    const listener = vi.fn();
    registry.subscribe(listener);

    const unregister = registry.register(item('scene.name', 'left', 0));

    expect(registry.getItems().map(({ id }) => id)).toEqual(['scene.name']);

    unregister();

    expect(registry.getItems()).toEqual([]);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('throws on a duplicate id in development', () => {
    const registry = createStatusBarRegistry();
    registry.register(item('scene.name', 'left', 0));

    expect(() => registry.register(item('scene.name', 'right', 0))).toThrow(
      'Duplicate status bar item id "scene.name".',
    );
  });
});

describe('statusBarZoneItems', () => {
  it('takes the items of one zone sorted by order', () => {
    const items = [item('fps', 'right', 20), item('scene', 'left', 0), item('memory', 'right', 10)];

    expect(statusBarZoneItems(items, 'right').map(({ id }) => id)).toEqual(['memory', 'fps']);
  });
});
