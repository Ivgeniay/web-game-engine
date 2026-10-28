import { createContext, useContext } from 'react';
import { useStore } from 'zustand';
import { createPlayModeStore } from './playMode/playModeStore';
import type { PlayModeState, PlayModeStore } from './playMode/playModeStore';
import { createSceneStore } from './scene/sceneStore';
import type { SceneState, SceneStore } from './scene/sceneStore';

export interface DemoStores {
  readonly playMode: PlayModeStore;
  readonly scene: SceneStore;
}

export function createDemoStores(): DemoStores {
  return { playMode: createPlayModeStore(), scene: createSceneStore() };
}

export const DemoStoresContext = createContext<DemoStores | null>(null);

export function useDemoStores(): DemoStores {
  const stores = useContext(DemoStoresContext);

  if (stores === null) {
    throw new Error('Demo stores are not provided. Wrap the tree in DemoStoresContext.');
  }

  return stores;
}

export function usePlayMode<Selected>(selector: (state: PlayModeState) => Selected): Selected {
  return useStore(useDemoStores().playMode, selector);
}

export function useScene<Selected>(selector: (state: SceneState) => Selected): Selected {
  return useStore(useDemoStores().scene, selector);
}
