import { messageRef } from '@/core/i18n/translate';
import { combineUnsubscribes } from '@/core/unsubscribe';
import type { Unsubscribe } from '@/core/unsubscribe';
import { defineWindow } from '@/core/windows/windowType';
import { demoMessages } from '@/demo/demoMessages';
import { frameworkIcons } from '@/icons/frameworkIcons';
import type { EditorRegistries } from '@/state/registries/editorRegistries';
import {
  HIERARCHY_WINDOW_ID,
  SCENE_WINDOW_ID,
  deleteObjectCommand,
  duplicateObjectCommand,
  hierarchyObjectMenu,
  inspectorComponentMenu,
  removeComponentCommand,
  renameObjectCommand,
  resetComponentCommand,
  toggleGridCommand,
} from './demoWindowCommands';
import { GameWindow } from './GameWindow';
import { HierarchyWindow } from './HierarchyWindow';
import { InspectorWindow } from './InspectorWindow';
import { ProjectWindow } from './ProjectWindow';
import { SceneWindow } from './SceneWindow';

export const sceneWindow = defineWindow({
  id: SCENE_WINDOW_ID,
  title: messageRef(demoMessages, 'scene'),
  icon: frameworkIcons['grid-view'],
  component: SceneWindow,
});

export const gameWindow = defineWindow({
  id: 'demo.game',
  title: messageRef(demoMessages, 'game'),
  icon: frameworkIcons.eye,
  component: GameWindow,
});

export const hierarchyWindow = defineWindow({
  id: HIERARCHY_WINDOW_ID,
  title: messageRef(demoMessages, 'hierarchy'),
  icon: frameworkIcons['list-view'],
  component: HierarchyWindow,
});

export const inspectorWindow = defineWindow({
  id: 'demo.inspector',
  title: messageRef(demoMessages, 'inspector'),
  icon: frameworkIcons.info,
  component: InspectorWindow,
});

export const projectWindow = defineWindow({
  id: 'demo.project',
  title: messageRef(demoMessages, 'project'),
  icon: frameworkIcons.folder,
  component: ProjectWindow,
});

const DEMO_WINDOWS = [sceneWindow, gameWindow, hierarchyWindow, inspectorWindow, projectWindow];

export function registerDemoWindows({ contextMenus, windows }: EditorRegistries): Unsubscribe {
  return combineUnsubscribes(
    ...DEMO_WINDOWS.map((windowType) => windows.register(windowType)),
    contextMenus.registerItem(sceneWindow.tabMenu, {
      path: 'grid',
      command: toggleGridCommand,
      group: 0,
      order: 0,
    }),
    contextMenus.registerItem(hierarchyObjectMenu, {
      path: 'rename',
      command: renameObjectCommand,
      withoutTarget: true,
      group: 0,
      order: 0,
    }),
    contextMenus.registerItem(hierarchyObjectMenu, {
      path: 'duplicate',
      command: duplicateObjectCommand,
      withoutTarget: true,
      group: 10,
      order: 0,
    }),
    contextMenus.registerItem(hierarchyObjectMenu, {
      path: 'delete',
      command: deleteObjectCommand,
      withoutTarget: true,
      group: 10,
      order: 10,
    }),
    contextMenus.registerItem(inspectorComponentMenu, {
      path: 'reset',
      command: resetComponentCommand,
      group: 0,
      order: 0,
    }),
    contextMenus.registerItem(inspectorComponentMenu, {
      path: 'remove',
      command: removeComponentCommand,
      group: 10,
      order: 0,
    }),
  );
}
