import { createStore } from 'zustand/vanilla';
import type { StoreApi } from 'zustand/vanilla';
import type { SceneSnapshot } from './sceneHierarchy';

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
  readonly enabled: boolean;
  readonly mass: number;
  readonly drag: number;
  readonly useGravity: boolean;
  readonly interpolate: Interpolation;
}

export interface Light {
  readonly enabled: boolean;
  readonly type: LightType;
  readonly intensity: number;
  readonly range: number;
  readonly castShadows: boolean;
}

export interface SceneObject {
  readonly id: string;
  readonly name: string;
  readonly parentId: string | null;
  readonly transform: Transform;
  readonly rigidbody: Rigidbody | null;
  readonly light: Light | null;
}

export type SceneObjectContent = Omit<SceneObject, 'id' | 'parentId'>;

export interface SceneState {
  readonly objects: readonly SceneObject[];
  readonly selectedIds: readonly string[];
  readonly tool: SceneTool;
  readonly gridVisible: boolean;
  readonly createId: () => string;
  readonly setSelection: (selectedIds: readonly string[]) => void;
  readonly restore: (snapshot: SceneSnapshot) => void;
  readonly updateObject: (id: string, update: (object: SceneObject) => SceneObject) => void;
  readonly setTool: (tool: SceneTool) => void;
  readonly toggleGrid: () => void;
}

export type SceneStore = StoreApi<SceneState>;

const OBJECT_ID_PREFIX = 'object-';

export const DEFAULT_TRANSFORM: Transform = {
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  scale: [1, 1, 1],
};

export const DEFAULT_RIGIDBODY: Rigidbody = {
  enabled: true,
  mass: 1,
  drag: 0,
  useGravity: true,
  interpolate: 'none',
};

export const DEFAULT_LIGHT: Light = {
  enabled: true,
  type: 'point',
  intensity: 1,
  range: 10,
  castShadows: false,
};

interface InitialObject {
  readonly key: string;
  readonly parentKey: string | null;
  readonly content: SceneObjectContent;
}

function plain(name: string, position: readonly number[] = [0, 0, 0]): SceneObjectContent {
  return { name, transform: { ...DEFAULT_TRANSFORM, position }, rigidbody: null, light: null };
}

const INITIAL_OBJECTS: readonly InitialObject[] = [
  { key: 'camera', parentKey: null, content: plain('Main Camera', [0, 1, -10]) },
  {
    key: 'sun',
    parentKey: null,
    content: {
      ...plain('Directional Light', [0, 3, 0]),
      transform: { ...DEFAULT_TRANSFORM, position: [0, 3, 0], rotation: [50, -30, 0] },
      light: { ...DEFAULT_LIGHT, type: 'directional', castShadows: true },
    },
  },
  { key: 'environment', parentKey: null, content: plain('Environment') },
  { key: 'ground', parentKey: 'environment', content: plain('Ground') },
  { key: 'rocks', parentKey: 'environment', content: plain('Rocks') },
  { key: 'rock-1', parentKey: 'rocks', content: plain('Rock', [2, 0, 3]) },
  { key: 'rock-2', parentKey: 'rocks', content: plain('Rock', [-4, 0, 1]) },
  {
    key: 'lamp',
    parentKey: 'environment',
    content: { ...plain('Lamp', [1, 2, 1]), light: { ...DEFAULT_LIGHT, intensity: 2 } },
  },
  {
    key: 'player',
    parentKey: null,
    content: { ...plain('Player'), rigidbody: DEFAULT_RIGIDBODY },
  },
  { key: 'model', parentKey: 'player', content: plain('Model') },
  { key: 'weapon', parentKey: 'player', content: plain('Weapon', [0.5, 1, 0]) },
];

export function findObject({ objects }: SceneState, id: string): SceneObject | null {
  return objects.find((object) => object.id === id) ?? null;
}

export function selectedObjects({ objects, selectedIds }: SceneState): readonly SceneObject[] {
  const selected = new Set(selectedIds);

  return objects.filter(({ id }) => selected.has(id));
}

export function sceneSnapshot({ objects, selectedIds }: SceneState): SceneSnapshot {
  return { objects, selectedIds };
}

export function createSceneStore(): SceneStore {
  let nextId = 0;

  function createId(): string {
    nextId += 1;

    return `${OBJECT_ID_PREFIX}${String(nextId)}`;
  }

  function createInitialObjects(): readonly SceneObject[] {
    const ids = new Map(INITIAL_OBJECTS.map(({ key }) => [key, createId()]));

    return INITIAL_OBJECTS.map(({ key, parentKey, content }) => ({
      ...content,
      id: ids.get(key) ?? key,
      parentId: parentKey === null ? null : (ids.get(parentKey) ?? null),
    }));
  }

  return createStore<SceneState>()((set) => ({
    objects: createInitialObjects(),
    selectedIds: [],
    tool: 'move',
    gridVisible: true,
    createId,
    setSelection(selectedIds) {
      set({ selectedIds });
    },
    restore({ objects, selectedIds }) {
      set({ objects, selectedIds });
    },
    updateObject(id, update) {
      set(({ objects }) => ({
        objects: objects.map((object) => (object.id === id ? update(object) : object)),
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
