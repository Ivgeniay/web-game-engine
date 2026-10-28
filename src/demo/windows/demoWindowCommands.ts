import { defineCommand } from '@/core/commands/command';
import { messageRef } from '@/core/i18n/translate';
import { defineContextMenu } from '@/core/menus/contextMenuRegistry';
import type { WindowTabTarget } from '@/core/windows/windowType';
import { demoMessages } from '@/demo/demoMessages';
import type { SceneObject } from '@/demo/scene/sceneStore';

export const SCENE_WINDOW_ID = 'demo.scene';
export const HIERARCHY_WINDOW_ID = 'demo.hierarchy';

export const frameSelectedCommand = defineCommand({
  id: 'scene.frameSelected',
  label: messageRef(demoMessages, 'frameSelected'),
  shortcut: { keys: 'KeyF', scope: SCENE_WINDOW_ID },
});

export const toggleGridCommand = defineCommand<WindowTabTarget>({
  id: 'scene.toggleGrid',
  label: messageRef(demoMessages, 'showGrid'),
});

export const duplicateObjectCommand = defineCommand({
  id: 'hierarchy.duplicate',
  label: messageRef(demoMessages, 'duplicate'),
  shortcut: { keys: 'Mod+KeyD', scope: HIERARCHY_WINDOW_ID },
});

export const deleteObjectCommand = defineCommand({
  id: 'hierarchy.delete',
  label: messageRef(demoMessages, 'delete'),
  shortcut: { keys: 'Delete', scope: HIERARCHY_WINDOW_ID },
});

export const hierarchyObjectMenu = defineContextMenu<SceneObject>({
  id: 'hierarchy.object',
  label: messageRef(demoMessages, 'hierarchy'),
});
