import { createStore } from 'zustand/vanilla';
import type { StoreApi } from 'zustand/vanilla';

export const PLAY_MODES = ['edit', 'play', 'paused'] as const;

export type PlayMode = (typeof PLAY_MODES)[number];

export interface PlayModeState {
  readonly mode: PlayMode;
  readonly frame: number;
  readonly togglePlay: () => void;
  readonly togglePause: () => void;
  readonly step: () => void;
}

export type PlayModeStore = StoreApi<PlayModeState>;

const FIRST_FRAME = 0;

export function createPlayModeStore(): PlayModeStore {
  return createStore<PlayModeState>()((set, get) => ({
    mode: 'edit',
    frame: FIRST_FRAME,
    togglePlay() {
      set(
        get().mode === 'edit'
          ? { mode: 'play', frame: FIRST_FRAME }
          : { mode: 'edit', frame: FIRST_FRAME },
      );
    },
    togglePause() {
      const { mode } = get();

      if (mode !== 'edit') {
        set({ mode: mode === 'play' ? 'paused' : 'play' });
      }
    },
    step() {
      const { mode, frame } = get();

      if (mode === 'paused') {
        set({ frame: frame + 1 });
      }
    },
  }));
}
