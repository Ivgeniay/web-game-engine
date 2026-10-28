import { describe, expect, it, vi } from 'vitest';
import { createRegistry } from './registry';

interface Entry {
  readonly id: string;
  readonly value: number;
}

function createEntryRegistry() {
  return createRegistry<Entry>({ kind: 'entry', getId: (entry) => entry.id });
}

const FIRST: Entry = { id: 'first', value: 1 };
const SECOND: Entry = { id: 'second', value: 2 };
const FIRST_AGAIN: Entry = { id: 'first', value: 3 };

describe('createRegistry', () => {
  it('starts empty', () => {
    const registry = createEntryRegistry();

    expect(registry.getSnapshot()).toEqual([]);
    expect(registry.get(FIRST.id)).toBeUndefined();
  });

  it('keeps entries in registration order and finds them by id', () => {
    const registry = createEntryRegistry();

    registry.register(SECOND);
    registry.register(FIRST);

    expect(registry.getSnapshot()).toEqual([SECOND, FIRST]);
    expect(registry.get(FIRST.id)).toBe(FIRST);
  });

  it('removes the entry when the registration is cancelled', () => {
    const registry = createEntryRegistry();
    const unregister = registry.register(FIRST);

    unregister();

    expect(registry.getSnapshot()).toEqual([]);
    expect(registry.get(FIRST.id)).toBeUndefined();
  });

  it('ignores a repeated cancellation', () => {
    const registry = createEntryRegistry();
    const unregister = registry.register(FIRST);
    unregister();
    registry.register(FIRST_AGAIN);

    unregister();

    expect(registry.get(FIRST.id)).toBe(FIRST_AGAIN);
  });

  it('throws on a duplicate id in development', () => {
    const registry = createEntryRegistry();
    registry.register(FIRST);

    expect(() => registry.register(FIRST_AGAIN)).toThrow('Duplicate entry id "first".');
    expect(registry.get(FIRST.id)).toBe(FIRST);
  });

  it('accepts the same id again after the first registration is cancelled', () => {
    const registry = createEntryRegistry();
    registry.register(FIRST)();

    registry.register(FIRST_AGAIN);

    expect(registry.get(FIRST.id)).toBe(FIRST_AGAIN);
  });

  it('keeps the snapshot identity until the entries change', () => {
    const registry = createEntryRegistry();
    registry.register(FIRST);
    const snapshot = registry.getSnapshot();

    expect(registry.getSnapshot()).toBe(snapshot);

    registry.register(SECOND);

    expect(registry.getSnapshot()).not.toBe(snapshot);
  });

  it('notifies subscribers about registrations and cancellations', () => {
    const registry = createEntryRegistry();
    const listener = vi.fn();
    registry.subscribe(listener);

    const unregister = registry.register(FIRST);
    unregister();

    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('stops notifying after unsubscribe', () => {
    const registry = createEntryRegistry();
    const listener = vi.fn();
    const unsubscribe = registry.subscribe(listener);

    unsubscribe();
    registry.register(FIRST);

    expect(listener).not.toHaveBeenCalled();
  });
});
