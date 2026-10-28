import { describe, expect, it } from 'vitest';
import { createPlayModeStore } from './playModeStore';

describe('createPlayModeStore', () => {
  it('enters and leaves Play mode', () => {
    const store = createPlayModeStore();
    store.getState().togglePlay();

    expect(store.getState().mode).toBe('play');

    store.getState().togglePlay();

    expect(store.getState().mode).toBe('edit');
  });

  it('pauses only in Play mode and steps only while paused', () => {
    const store = createPlayModeStore();
    store.getState().togglePause();
    store.getState().step();

    expect(store.getState()).toMatchObject({ mode: 'edit', frame: 0 });

    store.getState().togglePlay();
    store.getState().step();
    store.getState().togglePause();
    store.getState().step();
    store.getState().step();

    expect(store.getState()).toMatchObject({ mode: 'paused', frame: 2 });
  });

  it('starts from the first frame each time', () => {
    const store = createPlayModeStore();
    store.getState().togglePlay();
    store.getState().togglePause();
    store.getState().step();
    store.getState().togglePlay();
    store.getState().togglePlay();

    expect(store.getState().frame).toBe(0);
  });
});
