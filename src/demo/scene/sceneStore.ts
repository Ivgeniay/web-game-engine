import { createStore } from 'zustand/vanilla';
import type { StoreApi } from 'zustand/vanilla';

export const SCENE_TOOLS = ['move', 'rotate', 'scale'] as const;

export type SceneTool = (typeof SCENE_TOOLS)[number];

export const INTERPOLATIONS = ['none', 'interpolate', 'extrapolate'] as const;

export type Interpolation = (typeof INTERPOLATIONS)[number];

export const LIGHT_TYPES = ['directional', 'point', 'spot'] as const;

export type LightType = (typeof LIGHT_TYPES)[number];

export interface Transform {
  readonly position: readonly number[];
  readonly rotation: readonly number[];
  readonly scale: readonly number[];
}

export interface Rigidbody {
  readonly mass: number;
  readonly drag: number;
  readonly useGravity: boolean;
  readonly interpolate: Interpolation;
}

export interface Light {
  readonly type: LightType;
  readonly intensity: number;
  readonly range: number;
  readonly castShadows: boolean;
}

export interface SceneObject {
  readonly id: string;
  readonly name: string;
  readonly transform: Transform;
  readonly rigidbody: Rigidbody | null;
  readonly light: Light | null;
}

export type SceneObjectContent = Omit<SceneObject, 'id'>;

export interface SceneState {
  readonly objects: readonly SceneObject[];
  readonly selectedId: string | null;
  readonly tool: SceneTool;
  readonly gridVisible: boolean;
  readonly select: (id: string) => void;
  readonly create: (name: string) => void;
  readonly updateObject: (id: string, update: (object: SceneObject) => SceneObject) => void;
  readonly duplicateSelected: () => void;
  readonly deleteSelected: () => void;
  readonly setTool: (tool: SceneTool) => void;
  readonly toggleGrid: () => void;
}

export type SceneStore = StoreApi<SceneState>;

const OBJECT_ID_PREFIX = 'object-';

const DEFAULT_TRANSFORM: Transform = {
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  scale: [1, 1, 1],
};

const INITIAL_OBJECTS: readonly SceneObjectContent[] = [
  {
    name: 'Main Camera',
    transform: { ...DEFAULT_TRANSFORM, position: [0, 1, -10] },
    rigidbody: null,
    light: null,
  },
  {
    name: 'Directional Light',
    transform: { ...DEFAULT_TRANSFORM, position: [0, 3, 0], rotation: [50, -30, 0] },
    rigidbody: null,
    light: { type: 'directional', intensity: 1, range: 10, castShadows: true },
  },
  {
    name: 'Player',
    transform: DEFAULT_TRANSFORM,
    rigidbody: { mass: 1, drag: 0, useGravity: true, interpolate: 'none' },
    light: null,
  },
];

export function selectedObject({ objects, selectedId }: SceneState): SceneObject | null {
  return objects.find(({ id }) => id === selectedId) ?? null;
}

export function findObject({ objects }: SceneState, id: string): SceneObject | null {
  return objects.find((object) => object.id === id) ?? null;
}

export function createSceneStore(): SceneStore {
  let nextId = 0;

  function newObject(content: SceneObjectContent): SceneObject {
    nextId += 1;

    return { ...content, id: `${OBJECT_ID_PREFIX}${String(nextId)}` };
  }

  return createStore<SceneState>()((set, get) => {
    function add(content: SceneObjectContent): void {
      const object = newObject(content);
      set(({ objects }) => ({ objects: [...objects, object], selectedId: object.id }));
    }

    return {
      objects: INITIAL_OBJECTS.map(newObject),
      selectedId: null,
      tool: 'move',
      gridVisible: true,
      select(id) {
        set({ selectedId: id });
      },
      create(name) {
        add({ name, transform: DEFAULT_TRANSFORM, rigidbody: null, light: null });
      },
      updateObject(id, update) {
        set(({ objects }) => ({
          objects: objects.map((object) => (object.id === id ? update(object) : object)),
        }));
      },
      duplicateSelected() {
        const selected = selectedObject(get());

        if (selected !== null) {
          add(selected);
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
    };
  });
}
