import { describe, expect, it, vi } from 'vitest';
import { createFoldoutBroadcast } from './foldoutBroadcast';

describe('createFoldoutBroadcast', () => {
  it('passes the state to every subscriber until it unsubscribes', () => {
    const broadcast = createFoldoutBroadcast();
    const first = vi.fn();
    const second = vi.fn();
    const unsubscribe = broadcast.subscribe(first);
    broadcast.subscribe(second);

    broadcast.emit(true);
    unsubscribe();
    broadcast.emit(false);

    expect(first.mock.calls).toEqual([[true]]);
    expect(second.mock.calls).toEqual([[true], [false]]);
  });
});
