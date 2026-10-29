import { defineCommand } from '@/core/commands/command';
import type { CommandDefinition } from '@/core/commands/command';
import { messageRef } from '@/core/i18n/translate';
import type { MessageRef } from '@/core/i18n/translate';
import { combineUnsubscribes } from '@/core/unsubscribe';
import type { Unsubscribe } from '@/core/unsubscribe';
import type { EditorRegistries } from '@/state/registries/editorRegistries';
import { demoIcons } from '@/demo/demoIcons';
import { demoMessages } from '@/demo/demoMessages';
import { addObject, applySceneEdit } from './sceneEdits';
import { DEFAULT_TRANSFORM, SCENE_TOOLS } from './sceneStore';
import type { SceneStore, SceneTool } from './sceneStore';

const toolCommands: Readonly<Record<SceneTool, CommandDefinition>> = {
  move: defineCommand({
    id: 'tools.move',
    label: messageRef(demoMessages, 'moveTool'),
    icon: demoIcons.move,
    shortcut: { keys: 'KeyW' },
  }),
  rotate: defineCommand({
    id: 'tools.rotate',
    label: messageRef(demoMessages, 'rotateTool'),
    icon: demoIcons.rotate,
    shortcut: { keys: 'KeyE' },
  }),
  scale: defineCommand({
    id: 'tools.scale',
    label: messageRef(demoMessages, 'scaleTool'),
    icon: demoIcons.scale,
    shortcut: { keys: 'KeyR' },
  }),
};

const createEmptyCommand = defineCommand({
  id: 'gameObject.createEmpty',
  label: messageRef(demoMessages, 'createEmpty'),
});

const createCubeCommand = defineCommand({
  id: 'gameObject.createCube',
  label: messageRef(demoMessages, 'cube'),
});

const createSphereCommand = defineCommand({
  id: 'gameObject.createSphere',
  label: messageRef(demoMessages, 'sphere'),
});

const TOOLS_GROUP = 0;
const EMPTY_OBJECT_NAME = 'GameObject';
const CUBE_NAME = 'Cube';
const SPHERE_NAME = 'Sphere';

function registerTools({ commands, toolbar }: EditorRegistries, store: SceneStore): Unsubscribe {
  return combineUnsubscribes(
    ...SCENE_TOOLS.map((tool) => [tool, toolCommands[tool]] as const).flatMap(
      ([tool, command], order) => [
        commands.handle(command, {
          run: () => {
            store.getState().setTool(tool);
          },
          isChecked: () => store.getState().tool === tool,
        }),
        toolbar.register({
          kind: 'command',
          id: command.id,
          zone: 'left',
          group: TOOLS_GROUP,
          order,
          command,
        }),
      ],
    ),
  );
}

function registerGameObjectMenu(
  { commands, mainMenu, undo }: EditorRegistries,
  store: SceneStore,
): Unsubscribe {
  function create(name: string, label: MessageRef): () => void {
    return () => {
      const content = { name, transform: DEFAULT_TRANSFORM, rigidbody: null, light: null };

      applySceneEdit(store, undo, label, addObject(content, store.getState().createId()));
    };
  }

  return combineUnsubscribes(
    commands.handle(createEmptyCommand, {
      run: create(EMPTY_OBJECT_NAME, createEmptyCommand.label),
    }),
    commands.handle(createCubeCommand, { run: create(CUBE_NAME, createCubeCommand.label) }),
    commands.handle(createSphereCommand, { run: create(SPHERE_NAME, createSphereCommand.label) }),
    mainMenu.registerItem({
      path: 'gameObject/createEmpty',
      command: createEmptyCommand,
      group: 0,
      order: 0,
    }),
    mainMenu.registerMenu({
      path: 'gameObject/3d',
      label: messageRef(demoMessages, 'create3dObject'),
      group: 10,
      order: 0,
    }),
    mainMenu.registerItem({
      path: 'gameObject/3d/cube',
      command: createCubeCommand,
      group: 0,
      order: 0,
    }),
    mainMenu.registerItem({
      path: 'gameObject/3d/sphere',
      command: createSphereCommand,
      group: 0,
      order: 10,
    }),
  );
}

export function registerSceneCommands(editor: EditorRegistries, store: SceneStore): Unsubscribe {
  return combineUnsubscribes(
    registerTools(editor, store),
    registerGameObjectMenu(editor, store),
    store.subscribe(editor.commands.refresh),
  );
}
