import { createStore } from 'zustand/vanilla';
import type { StoreApi } from 'zustand/vanilla';

export const SCENE_TOOLS = ['move', 'rotate', 'scale'] as const;

export type SceneTool = (typeof SCENE_TOOLS)[number];

export interface SceneObject {
  readonly id: string;
  readonly name: string;
}

export interface SceneState {
  readonly objects: readonly SceneObject[];
  readonly selectedId: string | null;
  readonly tool: SceneTool;
  readonly gridVisible: boolean;
  readonly select: (id: string) => void;
  readonly create: (name: string) => void;
  readonly duplicateSelected: () => void;
  readonly deleteSelected: () => void;
  readonly setTool: (tool: SceneTool) => void;
  readonly toggleGrid: () => void;
}

export type SceneStore = StoreApi<SceneState>;

const INITIAL_OBJECT_NAMES: readonly string[] = ['Main Camera', 'Directional Light', 'Player'];
const OBJECT_ID_PREFIX = 'object-';

export function selectedObject({ objects, selectedId }: SceneState): SceneObject | null {
  return objects.find(({ id }) => id === selectedId) ?? null;
}

export function createSceneStore(): SceneStore {
  let nextId = 0;

  function newObject(name: string): SceneObject {
    nextId += 1;

    return { id: `${OBJECT_ID_PREFIX}${String(nextId)}`, name };
  }

  return createStore<SceneState>()((set, get) => ({
    objects: INITIAL_OBJECT_NAMES.map(newObject),
    selectedId: null,
    tool: 'move',
    gridVisible: true,
    select(id) {
      set({ selectedId: id });
    },
    create(name) {
      const object = newObject(name);
      set(({ objects }) => ({ objects: [...objects, object], selectedId: object.id }));
    },
    duplicateSelected() {
      const selected = selectedObject(get());

      if (selected !== null) {
        get().create(selected.name);
      }
    },
    deleteSelected() {
      set(({ objects, selectedId }) => ({
        objects: objects.filter(({ id }) => id !== selectedId),
        selectedId: null,
      }));
    },
    setTool(tool) {
      set({ tool });
    },
    toggleGrid() {
      set(({ gridVisible }) => ({ gridVisible: !gridVisible }));
    },
  }));
}
