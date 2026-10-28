import { describe, expect, it, vi } from 'vitest';
import { createRovingFocusRegistry } from './rovingFocusRegistry';
import type { RovingFocusItem } from './rovingFocusRegistry';

interface FakeElement {
  readonly position: number;
}

function createRegistry() {
  return createRovingFocusRegistry<FakeElement>(
    (first, second) => first.position - second.position,
  );
}

function item(position: number, flags: Partial<RovingFocusItem<FakeElement>> = {}) {
  return { element: { position }, disabled: false, preferred: false, ...flags };
}

describe('createRovingFocusRegistry', () => {
  it('has no tab stop while empty', () => {
    expect(createRegistry().getTabStopId()).toBeUndefined();
  });

  it('orders entries by element position, not by registration order', () => {
    const registry = createRegistry();
    registry.setItem('c', item(3));
    registry.setItem('a', item(1));
    registry.setItem('b', item(2));

    expect(registry.getOrderedEntries().map((entry) => entry.id)).toEqual(['a', 'b', 'c']);
    expect(registry.getTabStopId()).toBe('a');
  });

  it('makes the first enabled item the tab stop', () => {
    const registry = createRegistry();
    registry.setItem('a', item(1, { disabled: true }));
    registry.setItem('b', item(2));

    expect(registry.getTabStopId()).toBe('b');
  });

  it('prefers a preferred item over the first one', () => {
    const registry = createRegistry();
    registry.setItem('a', item(1));
    registry.setItem('b', item(2, { preferred: true }));

    expect(registry.getTabStopId()).toBe('b');
  });

  it('keeps the active item as the tab stop over a preferred one', () => {
    const registry = createRegistry();
    registry.setItem('a', item(1));
    registry.setItem('b', item(2, { preferred: true }));
    registry.setActive('a');

    expect(registry.getTabStopId()).toBe('a');
  });

  it('falls back when the active item is disabled or removed', () => {
    const registry = createRegistry();
    registry.setItem('a', item(1));
    registry.setItem('b', item(2));
    registry.setItem('c', item(3));
    registry.setActive('c');

    registry.setItem('c', item(3, { disabled: true }));
    expect(registry.getTabStopId()).toBe('a');

    registry.setItem('c', item(3));
    expect(registry.getTabStopId()).toBe('c');

    registry.removeItem('c');
    expect(registry.getTabStopId()).toBe('a');
  });

  it('has no tab stop when every item is disabled', () => {
    const registry = createRegistry();
    registry.setItem('a', item(1, { disabled: true }));

    expect(registry.getTabStopId()).toBeUndefined();
  });

  it('notifies subscribers about changes until they unsubscribe', () => {
    const registry = createRegistry();
    const listener = vi.fn();
    const unsubscribe = registry.subscribe(listener);

    registry.setItem('a', item(1));
    registry.setActive('a');
    registry.removeItem('a');
    expect(listener).toHaveBeenCalledTimes(3);

    unsubscribe();
    registry.setItem('a', item(1));
    expect(listener).toHaveBeenCalledTimes(3);
  });
});
