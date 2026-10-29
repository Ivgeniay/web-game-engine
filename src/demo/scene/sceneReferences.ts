import type { DragData } from '@/contracts/dragData';
import type { ReferenceProvider } from '@/contracts/property';
import type { ThumbnailLoader } from '@/contracts/thumbnail';
import { messageRef } from '@/core/i18n/translate';
import { demoMessages } from '@/demo/demoMessages';
import {
  PROJECT_ASSET_DRAG_TYPE,
  assetNameOf,
  projectFilesWithExtension,
} from '@/demo/project/projectAssets';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { findObject } from './sceneStore';
import type { SceneObject, SceneStore } from './sceneStore';

export const SCENE_OBJECT_DRAG_TYPE = 'demo.scene-object';

const EXTENSION_PATTERN = /\.[^.]+$/;

function withoutExtension(name: string): string {
  return name.replace(EXTENSION_PATTERN, '');
}

function firstDraggedId(data: DragData, type: string): string | null {
  const [id] = data.ids;

  return data.type === type && data.ids.length === 1 && id !== undefined ? id : null;
}

export function createAssetReferenceProvider(
  scene: SceneStore,
  extension: string,
  usedBy: (object: SceneObject) => string | null,
  loadThumbnail: ThumbnailLoader,
): ReferenceProvider {
  return {
    tabs: [
      {
        id: 'assets',
        label: messageRef(demoMessages, 'assetsTab'),
        getItemIds: () => projectFilesWithExtension(extension),
      },
      {
        id: 'scene',
        label: messageRef(demoMessages, 'sceneTab'),
        getItemIds: () => [
          ...new Set(scene.getState().objects.flatMap((object) => usedBy(object) ?? [])),
        ],
      },
    ],
    getLabel: (path) => withoutExtension(assetNameOf(path)),
    getIcon: () => frameworkIcons.file,
    loadThumbnail,
    dragTypes: [PROJECT_ASSET_DRAG_TYPE],
    resolveDrop: (data) => {
      const path = firstDraggedId(data, PROJECT_ASSET_DRAG_TYPE);

      return path !== null && path.endsWith(extension) ? path : null;
    },
  };
}

export function createSceneObjectReferenceProvider(scene: SceneStore): ReferenceProvider {
  return {
    tabs: [
      {
        id: 'scene',
        label: messageRef(demoMessages, 'sceneTab'),
        getItemIds: () => scene.getState().objects.map(({ id }) => id),
      },
    ],
    getLabel: (id) => findObject(scene.getState(), id)?.name ?? id,
    getIcon: () => frameworkIcons['list-view'],
    dragTypes: [SCENE_OBJECT_DRAG_TYPE],
    resolveDrop: (data) => {
      const id = firstDraggedId(data, SCENE_OBJECT_DRAG_TYPE);

      return id !== null && findObject(scene.getState(), id) !== null ? id : null;
    },
  };
}
