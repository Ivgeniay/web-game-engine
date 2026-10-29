import type { InspectorSectionTarget } from '@/contracts/inspector';
import { defineCommand } from '@/core/commands/command';
import { commonMessages } from '@/core/i18n/commonMessages';
import { messageRef } from '@/core/i18n/translate';
import { defineContextMenu } from '@/core/menus/contextMenuRegistry';
import type { WindowTabTarget } from '@/core/windows/windowType';
import { demoMessages } from '@/demo/demoMessages';

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

export const renameObjectCommand = defineCommand({
  id: 'hierarchy.rename',
  label: messageRef(demoMessages, 'rename'),
});

export const hierarchyObjectMenu = defineContextMenu<readonly string[]>({
  id: 'hierarchy.object',
  label: messageRef(demoMessages, 'hierarchy'),
});

export const resetComponentCommand = defineCommand<InspectorSectionTarget>({
  id: 'inspector.resetComponent',
  label: messageRef(commonMessages, 'reset'),
});

export const removeComponentCommand = defineCommand<InspectorSectionTarget>({
  id: 'inspector.removeComponent',
  label: messageRef(demoMessages, 'removeComponent'),
});
