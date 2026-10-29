import type { InspectorSection, InspectorSource } from '@/contracts/inspector';
import { messageRef } from '@/core/i18n/translate';
import {
  booleanProperty,
  colorProperty,
  enumProperty,
  flagsProperty,
  listProperty,
  numberProperty,
  referenceProperty,
  stringProperty,
  vectorProperty,
} from '@/core/inspector/properties';
import { demoMessages } from '@/demo/demoMessages';
import { createAssetPreviewLoader } from '@/demo/project/assetPreviews';
import { COMPONENT_KINDS, hasComponent } from '@/demo/scene/sceneComponents';
import {
  createAssetReferenceProvider,
  createSceneObjectReferenceProvider,
} from '@/demo/scene/sceneReferences';
import type { ComponentKind } from '@/demo/scene/sceneComponents';
import {
  DEFAULT_LIGHT,
  DEFAULT_MESH_RENDERER,
  DEFAULT_NOTE,
  DEFAULT_PATH,
  DEFAULT_RIGIDBODY,
  DEFAULT_TRANSFORM,
  RIGIDBODY_CONSTRAINTS,
  findObject,
} from '@/demo/scene/sceneStore';
import type {
  Light,
  MeshRenderer,
  Note,
  Path,
  Rigidbody,
  SceneObject,
  SceneStore,
  Transform,
  Waypoint,
} from '@/demo/scene/sceneStore';

const MIN_MASS = 0;
const MIN_DRAG = 0;
const MIN_INTENSITY = 0;
const MAX_INTENSITY = 8;
const MIN_RANGE = 0;
const MIN_SHADOW_STRENGTH = 0;
const MAX_SHADOW_STRENGTH = 1;
const ROTATION_STEP = 1;
const ORIGIN: readonly number[] = [0, 0, 0];
const SECTION_TYPE_PREFIX = 'demo.';
const MESH_EXTENSION = '.fbx';
const MATERIAL_EXTENSION = '.mat';

export function componentOfSection(section: InspectorSection): ComponentKind | undefined {
  return COMPONENT_KINDS.find((kind) => kind === section.id);
}

export function createNameProperty(scene: SceneStore) {
  return stringProperty({
    id: 'name',
    label: messageRef(demoMessages, 'name'),
    read: (id) => findObject(scene.getState(), id)?.name ?? '',
    write: (id, name) => {
      scene.getState().updateObject(id, (object) => ({ ...object, name }));
    },
  });
}

function createSections(scene: SceneStore): readonly InspectorSection[] {
  const objectOf = (id: string): SceneObject | null => findObject(scene.getState(), id);
  const update = (id: string, edit: (object: SceneObject) => SceneObject) => {
    scene.getState().updateObject(id, edit);
  };

  const transformOf = (id: string): Transform => objectOf(id)?.transform ?? DEFAULT_TRANSFORM;
  const rigidbodyOf = (id: string): Rigidbody => objectOf(id)?.rigidbody ?? DEFAULT_RIGIDBODY;
  const lightOf = (id: string): Light => objectOf(id)?.light ?? DEFAULT_LIGHT;
  const pathOf = (id: string): Path => objectOf(id)?.path ?? DEFAULT_PATH;
  const noteOf = (id: string): Note => objectOf(id)?.note ?? DEFAULT_NOTE;
  const rendererOf = (id: string): MeshRenderer =>
    objectOf(id)?.meshRenderer ?? DEFAULT_MESH_RENDERER;

  const patchTransform = (id: string, patch: Partial<Transform>) => {
    update(id, (object) => ({ ...object, transform: { ...object.transform, ...patch } }));
  };
  const patchRigidbody = (id: string, patch: Partial<Rigidbody>) => {
    update(id, (object) =>
      object.rigidbody === null
        ? object
        : { ...object, rigidbody: { ...object.rigidbody, ...patch } },
    );
  };
  const patchRenderer = (id: string, patch: Partial<MeshRenderer>) => {
    update(id, (object) =>
      object.meshRenderer === null
        ? object
        : { ...object, meshRenderer: { ...object.meshRenderer, ...patch } },
    );
  };
  const loadAssetPreview = createAssetPreviewLoader();
  const meshes = createAssetReferenceProvider(
    scene,
    MESH_EXTENSION,
    (object) => object.meshRenderer?.mesh ?? null,
    loadAssetPreview,
  );
  const materials = createAssetReferenceProvider(
    scene,
    MATERIAL_EXTENSION,
    (object) => object.meshRenderer?.material ?? null,
    loadAssetPreview,
  );
  const sceneObjects = createSceneObjectReferenceProvider(scene);
  const patchLight = (id: string, patch: Partial<Light>) => {
    update(id, (object) =>
      object.light === null ? object : { ...object, light: { ...object.light, ...patch } },
    );
  };

  const transformVector = (key: keyof Transform, step?: number) =>
    vectorProperty({
      id: key,
      label: messageRef(demoMessages, key),
      dimensions: 3,
      step,
      defaultValue: DEFAULT_TRANSFORM[key],
      read: (id) => transformOf(id)[key],
      write: (id, value) => {
        patchTransform(id, { [key]: value });
      },
    });

  const newWaypoint = (position: readonly number[]): Waypoint => ({
    id: scene.getState().createId(),
    position,
  });

  return [
    {
      id: 'transform',
      type: `${SECTION_TYPE_PREFIX}transform`,
      title: messageRef(demoMessages, 'transform'),
      items: [
        transformVector('position'),
        transformVector('rotation', ROTATION_STEP),
        transformVector('scale'),
      ],
    },
    {
      id: 'meshRenderer',
      type: `${SECTION_TYPE_PREFIX}meshRenderer`,
      title: messageRef(demoMessages, 'meshRenderer'),
      enabled: {
        read: (id) => rendererOf(id).enabled,
        write: (id, enabled) => {
          patchRenderer(id, { enabled });
        },
      },
      items: [
        referenceProperty({
          id: 'mesh',
          label: messageRef(demoMessages, 'mesh'),
          provider: meshes,
          defaultValue: DEFAULT_MESH_RENDERER.mesh,
          read: (id) => rendererOf(id).mesh,
          write: (id, mesh) => {
            patchRenderer(id, { mesh });
          },
        }),
        referenceProperty({
          id: 'material',
          label: messageRef(demoMessages, 'material'),
          provider: materials,
          defaultValue: DEFAULT_MESH_RENDERER.material,
          read: (id) => rendererOf(id).material,
          write: (id, material) => {
            patchRenderer(id, { material });
          },
        }),
        referenceProperty({
          id: 'anchorOverride',
          label: messageRef(demoMessages, 'anchorOverride'),
          provider: sceneObjects,
          defaultValue: DEFAULT_MESH_RENDERER.anchorOverride,
          read: (id) => rendererOf(id).anchorOverride,
          write: (id, anchorOverride) => {
            patchRenderer(id, { anchorOverride });
          },
        }),
      ],
    },
    {
      id: 'rigidbody',
      type: `${SECTION_TYPE_PREFIX}rigidbody`,
      title: messageRef(demoMessages, 'rigidbody'),
      enabled: {
        read: (id) => rigidbodyOf(id).enabled,
        write: (id, enabled) => {
          patchRigidbody(id, { enabled });
        },
      },
      items: [
        numberProperty({
          id: 'mass',
          label: messageRef(demoMessages, 'mass'),
          min: MIN_MASS,
          defaultValue: DEFAULT_RIGIDBODY.mass,
          read: (id) => rigidbodyOf(id).mass,
          write: (id, mass) => {
            patchRigidbody(id, { mass });
          },
        }),
        numberProperty({
          id: 'drag',
          label: messageRef(demoMessages, 'drag'),
          min: MIN_DRAG,
          defaultValue: DEFAULT_RIGIDBODY.drag,
          read: (id) => rigidbodyOf(id).drag,
          write: (id, drag) => {
            patchRigidbody(id, { drag });
          },
        }),
        booleanProperty({
          id: 'useGravity',
          label: messageRef(demoMessages, 'useGravity'),
          defaultValue: DEFAULT_RIGIDBODY.useGravity,
          read: (id) => rigidbodyOf(id).useGravity,
          write: (id, useGravity) => {
            patchRigidbody(id, { useGravity });
          },
        }),
        enumProperty({
          id: 'interpolate',
          label: messageRef(demoMessages, 'interpolate'),
          options: [
            { value: 'none', label: messageRef(demoMessages, 'interpolationNone') },
            { value: 'interpolate', label: messageRef(demoMessages, 'interpolationInterpolate') },
            { value: 'extrapolate', label: messageRef(demoMessages, 'interpolationExtrapolate') },
          ],
          defaultValue: DEFAULT_RIGIDBODY.interpolate,
          read: (id) => rigidbodyOf(id).interpolate,
          write: (id, interpolate) => {
            patchRigidbody(id, { interpolate });
          },
        }),
        flagsProperty({
          id: 'constraints',
          label: messageRef(demoMessages, 'constraints'),
          options: RIGIDBODY_CONSTRAINTS.map((constraint) => ({
            value: constraint,
            label: messageRef(demoMessages, constraint),
          })),
          defaultValue: DEFAULT_RIGIDBODY.constraints,
          read: (id) => rigidbodyOf(id).constraints,
          write: (id, constraints) => {
            patchRigidbody(id, { constraints });
          },
        }),
      ],
    },
    {
      id: 'light',
      type: `${SECTION_TYPE_PREFIX}light`,
      title: messageRef(demoMessages, 'light'),
      enabled: {
        read: (id) => lightOf(id).enabled,
        write: (id, enabled) => {
          patchLight(id, { enabled });
        },
      },
      items: [
        enumProperty({
          id: 'type',
          label: messageRef(demoMessages, 'lightType'),
          options: [
            { value: 'directional', label: messageRef(demoMessages, 'lightDirectional') },
            { value: 'point', label: messageRef(demoMessages, 'lightPoint') },
            { value: 'spot', label: messageRef(demoMessages, 'lightSpot') },
          ],
          defaultValue: DEFAULT_LIGHT.type,
          read: (id) => lightOf(id).type,
          write: (id, type) => {
            patchLight(id, { type });
          },
        }),
        colorProperty({
          id: 'color',
          label: messageRef(demoMessages, 'color'),
          defaultValue: DEFAULT_LIGHT.color,
          read: (id) => lightOf(id).color,
          write: (id, color) => {
            patchLight(id, { color });
          },
        }),
        numberProperty({
          id: 'intensity',
          label: messageRef(demoMessages, 'intensity'),
          slider: true,
          min: MIN_INTENSITY,
          max: MAX_INTENSITY,
          defaultValue: DEFAULT_LIGHT.intensity,
          read: (id) => lightOf(id).intensity,
          write: (id, intensity) => {
            patchLight(id, { intensity });
          },
        }),
        numberProperty({
          id: 'range',
          label: messageRef(demoMessages, 'range'),
          min: MIN_RANGE,
          defaultValue: DEFAULT_LIGHT.range,
          read: (id) => lightOf(id).range,
          write: (id, range) => {
            patchLight(id, { range });
          },
        }),
        {
          type: 'group',
          id: 'shadows',
          label: messageRef(demoMessages, 'shadows'),
          properties: [
            booleanProperty({
              id: 'castShadows',
              label: messageRef(demoMessages, 'castShadows'),
              defaultValue: DEFAULT_LIGHT.castShadows,
              read: (id) => lightOf(id).castShadows,
              write: (id, castShadows) => {
                patchLight(id, { castShadows });
              },
            }),
            numberProperty({
              id: 'shadowStrength',
              label: messageRef(demoMessages, 'shadowStrength'),
              slider: true,
              min: MIN_SHADOW_STRENGTH,
              max: MAX_SHADOW_STRENGTH,
              defaultValue: DEFAULT_LIGHT.shadowStrength,
              read: (id) => lightOf(id).shadowStrength,
              write: (id, shadowStrength) => {
                patchLight(id, { shadowStrength });
              },
            }),
          ],
        },
      ],
    },
    {
      id: 'path',
      type: `${SECTION_TYPE_PREFIX}path`,
      title: messageRef(demoMessages, 'path'),
      items: [
        listProperty({
          id: 'waypoints',
          label: messageRef(demoMessages, 'waypoints'),
          item: {
            type: 'vector',
            dimensions: 3,
            read: (waypoint) => waypoint.position,
            write: (waypoint, position) => ({ ...waypoint, position }),
          },
          createItem: () => newWaypoint(ORIGIN),
          copyItem: (waypoint) => newWaypoint(waypoint.position),
          getItemKey: (waypoint) => waypoint.id,
          read: (id) => pathOf(id).waypoints,
          write: (id, waypoints) => {
            update(id, (object) =>
              object.path === null ? object : { ...object, path: { ...object.path, waypoints } },
            );
          },
        }),
      ],
    },
    {
      id: 'note',
      type: `${SECTION_TYPE_PREFIX}note`,
      title: messageRef(demoMessages, 'note'),
      items: [
        stringProperty({
          id: 'text',
          label: messageRef(demoMessages, 'noteText'),
          multiline: true,
          defaultValue: DEFAULT_NOTE.text,
          read: (id) => noteOf(id).text,
          write: (id, text) => {
            update(id, (object) => (object.note === null ? object : { ...object, note: { text } }));
          },
        }),
      ],
    },
  ];
}

export function createDemoInspectorSource(scene: SceneStore): InspectorSource {
  const sections = createSections(scene);

  return {
    getSections: (targetIds) => {
      const objects = targetIds.flatMap((id) => findObject(scene.getState(), id) ?? []);

      return sections.filter((section) => {
        const component = componentOfSection(section);

        return (
          component !== undefined && objects.every((object) => hasComponent(object, component))
        );
      });
    },
    subscribe: (listener) =>
      scene.subscribe(() => {
        listener();
      }),
  };
}
