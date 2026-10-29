import { createStore } from 'zustand/vanilla';
import type { StoreApi } from 'zustand/vanilla';
import type { Color } from '@/contracts/color';
import type { SceneSnapshot } from './sceneHierarchy';

export const SCENE_TOOLS = ['move', 'rotate', 'scale'] as const;

export type SceneTool = (typeof SCENE_TOOLS)[number];

export const INTERPOLATIONS = ['none', 'interpolate', 'extrapolate'] as const;

export type Interpolation = (typeof INTERPOLATIONS)[number];

export const LIGHT_TYPES = ['directional', 'point', 'spot'] as const;

export const RIGIDBODY_CONSTRAINTS = [
  'freezePositionX',
  'freezePositionY',
  'freezePositionZ',
  'freezeRotationX',
  'freezeRotationY',
  'freezeRotationZ',
] as const;

export type RigidbodyConstraint = (typeof RIGIDBODY_CONSTRAINTS)[number];

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
  readonly constraints: readonly RigidbodyConstraint[];
}

export interface Light {
  readonly enabled: boolean;
  readonly type: LightType;
  readonly color: Color;
  readonly intensity: number;
  readonly range: number;
  readonly castShadows: boolean;
  readonly shadowStrength: number;
}

export interface Waypoint {
  readonly id: string;
  readonly position: readonly number[];
}

export interface Path {
  readonly waypoints: readonly Waypoint[];
}

export interface Note {
  readonly text: string;
}

export interface SceneObject {
  readonly id: string;
  readonly name: string;
  readonly parentId: string | null;
  readonly transform: Transform;
  readonly rigidbody: Rigidbody | null;
  readonly light: Light | null;
  readonly path: Path | null;
  readonly note: Note | null;
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
  constraints: [],
};

export const DEFAULT_PATH: Path = { waypoints: [] };

export const DEFAULT_NOTE: Note = { text: '' };

export const DEFAULT_LIGHT: Light = {
  enabled: true,
  type: 'point',
  color: { r: 1, g: 1, b: 1, a: 1 },
  intensity: 1,
  range: 10,
  castShadows: false,
  shadowStrength: 1,
};

interface InitialObject {
  readonly key: string;
  readonly parentKey: string | null;
  readonly content: SceneObjectContent;
}

function plain(name: string, position: readonly number[] = [0, 0, 0]): SceneObjectContent {
  return {
    name,
    transform: { ...DEFAULT_TRANSFORM, position },
    rigidbody: null,
    light: null,
    path: null,
    note: null,
  };
}

const INITIAL_OBJECTS: readonly InitialObject[] = [
  { key: 'camera', parentKey: null, content: plain('Main Camera', [0, 1, -10]) },
  {
    key: 'sun',
    parentKey: null,
    content: {
      ...plain('Directional Light', [0, 3, 0]),
      transform: { ...DEFAULT_TRANSFORM, position: [0, 3, 0], rotation: [50, -30, 0] },
      light: {
        ...DEFAULT_LIGHT,
        type: 'directional',
        color: { r: 1, g: 0.96, b: 0.84, a: 1 },
        castShadows: true,
      },
    },
  },
  { key: 'environment', parentKey: null, content: plain('Environment') },
  { key: 'ground', parentKey: 'environment', content: plain('Ground') },
  { key: 'rocks', parentKey: 'environment', content: plain('Rocks') },
  {
    key: 'rock-1',
    parentKey: 'rocks',
    content: { ...plain('Rock', [2, 0, 3]), note: { text: 'Cover for the first wave.' } },
  },
  {
    key: 'rock-2',
    parentKey: 'rocks',
    content: {
      ...plain('Rock', [-4, 0, 1]),
      note: { text: 'Too close to the bridge.\nMove it before the next build.' },
    },
  },
  {
    key: 'lamp',
    parentKey: 'environment',
    content: {
      ...plain('Lamp', [1, 2, 1]),
      light: { ...DEFAULT_LIGHT, color: { r: 1, g: 0.7, b: 0.35, a: 1 }, intensity: 2 },
    },
  },
  {
    key: 'player',
    parentKey: null,
    content: {
      ...plain('Player'),
      rigidbody: { ...DEFAULT_RIGIDBODY, constraints: ['freezeRotationX', 'freezeRotationZ'] },
      path: {
        waypoints: [
          { id: 'waypoint-1', position: [0, 0, 0] },
          { id: 'waypoint-2', position: [4, 0, 2] },
          { id: 'waypoint-3', position: [8, 0, -1] },
        ],
      },
    },
  },
  { key: 'model', parentKey: 'player', content: plain('Model') },
  {
    key: 'weapon',
    parentKey: 'player',
    content: {
      ...plain('Weapon', [0.5, 1, 0]),
      rigidbody: { ...DEFAULT_RIGIDBODY, mass: 0.2, constraints: ['freezeRotationX'] },
      path: { waypoints: [{ id: 'waypoint-4', position: [0.5, 1, 0] }] },
    },
  },
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
