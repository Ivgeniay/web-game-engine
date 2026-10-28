import { useState } from 'react';
import { defineCommand } from '@/core/commands/command';
import type { EditorExtension } from '@/contracts/editorExtension';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import type { MessageRef } from '@/core/i18n/translate';
import { defineContextMenu } from '@/core/menus/contextMenuRegistry';
import { combineUnsubscribes } from '@/core/unsubscribe';
import { ContextMenu } from '@/shell/ContextMenu';
import { useContextMenu } from '@/shell/useContextMenu';
import { useMessages } from '@/state/language/useMessages';
import { useTranslate } from '@/state/language/useTranslate';
import { createEditorRegistries } from '@/state/registries/editorRegistries';
import { RegistriesProvider } from '@/state/registries/RegistriesProvider';
import { Label } from '@/ui/label/Label';
import styles from './ContextMenuExample.module.css';

const hierarchyMessages = defineMessages({
  en: {
    hierarchy: 'Hierarchy',
    object: 'Object',
    rename: 'Rename',
    duplicate: 'Duplicate',
    paste: 'Paste',
    create: 'Create',
    emptyObject: 'Empty object',
    hint: 'Right-click an object or the empty space, or focus an object and press Shift+F10',
    renamed: 'Rename {name}',
    duplicated: 'Duplicate {name}',
    pasted: 'Paste',
    created: 'Create an empty object',
  },
  ru: {
    hierarchy: 'Hierarchy',
    object: 'Объект',
    rename: 'Переименовать',
    duplicate: 'Дублировать',
    paste: 'Вставить',
    create: 'Создать',
    emptyObject: 'Пустой объект',
    hint: 'Щёлкните правой кнопкой по объекту или пустому месту, или выберите объект и нажмите Shift+F10',
    renamed: 'Переименовать {name}',
    duplicated: 'Дублировать {name}',
    pasted: 'Вставить',
    created: 'Создать пустой объект',
  },
});

const lightingMessages = defineMessages({
  en: { bake: 'Bake lighting for {name}', bakeItem: 'Bake lighting' },
  ru: { bake: 'Запечь освещение для {name}', bakeItem: 'Запечь освещение' },
});

interface SceneObject {
  readonly name: string;
}

const SCENE_OBJECTS: readonly SceneObject[] = [
  { name: 'Main Camera' },
  { name: 'Directional Light' },
  { name: 'Player' },
];

const objectMenu = defineContextMenu<SceneObject>({
  id: 'hierarchy.item',
  label: messageRef(hierarchyMessages, 'object'),
});
const emptySpaceMenu = defineContextMenu<undefined>({
  id: 'hierarchy.area',
  label: messageRef(hierarchyMessages, 'hierarchy'),
});

const renameObject = defineCommand<SceneObject>({
  id: 'hierarchy.rename',
  label: messageRef(hierarchyMessages, 'rename'),
});
const duplicateObject = defineCommand<SceneObject>({
  id: 'hierarchy.duplicate',
  label: messageRef(hierarchyMessages, 'duplicate'),
});
const paste = defineCommand({
  id: 'edit.paste',
  label: messageRef(hierarchyMessages, 'paste'),
  shortcut: { keys: 'Mod+KeyV' },
});
const createEmpty = defineCommand({
  id: 'hierarchy.createEmpty',
  label: messageRef(hierarchyMessages, 'emptyObject'),
});
const bakeLighting = defineCommand<SceneObject>({
  id: 'lighting.bake',
  label: messageRef(lightingMessages, 'bakeItem'),
});

type Report = (action: MessageRef) => void;

function hierarchyExtension(report: Report): EditorExtension {
  return ({ contextMenus, commands }) =>
    combineUnsubscribes(
      contextMenus.registerItem(objectMenu, {
        path: 'rename',
        command: renameObject,
        group: 0,
        order: 0,
      }),
      contextMenus.registerItem(objectMenu, {
        path: 'duplicate',
        command: duplicateObject,
        group: 0,
        order: 10,
      }),
      contextMenus.registerItem(objectMenu, {
        path: 'paste',
        command: paste,
        withoutTarget: true,
        group: 10,
        order: 0,
      }),
      contextMenus.registerMenu(emptySpaceMenu, {
        path: 'create',
        label: messageRef(hierarchyMessages, 'create'),
        group: 0,
        order: 0,
      }),
      contextMenus.registerItem(emptySpaceMenu, {
        path: 'create/empty',
        command: createEmpty,
        group: 0,
        order: 0,
      }),
      contextMenus.registerItem(emptySpaceMenu, {
        path: 'paste',
        command: paste,
        group: 10,
        order: 0,
      }),
      commands.handle(renameObject, {
        run: ({ target }) => {
          report(messageRef(hierarchyMessages, 'renamed', { name: target.name }));
        },
      }),
      commands.handle(duplicateObject, {
        run: ({ target }) => {
          report(messageRef(hierarchyMessages, 'duplicated', { name: target.name }));
        },
      }),
      commands.handle(paste, {
        run: () => {
          report(messageRef(hierarchyMessages, 'pasted'));
        },
      }),
      commands.handle(createEmpty, {
        run: () => {
          report(messageRef(hierarchyMessages, 'created'));
        },
      }),
    );
}

function lightingExtension(report: Report): EditorExtension {
  return ({ contextMenus, commands }) =>
    combineUnsubscribes(
      contextMenus.registerItem(objectMenu, {
        path: 'bake',
        command: bakeLighting,
        group: 20,
        order: 0,
      }),
      commands.handle(bakeLighting, {
        run: ({ target }) => {
          report(messageRef(lightingMessages, 'bake', { name: target.name }));
        },
        isEnabled: ({ target }) => target.name.endsWith('Light'),
      }),
    );
}

export function ContextMenuExample() {
  const [lastAction, setLastAction] = useState<MessageRef | null>(null);
  const [editor] = useState(() => {
    const registries = createEditorRegistries();
    hierarchyExtension(setLastAction)(registries);
    lightingExtension(setLastAction)(registries);

    return registries;
  });

  return (
    <RegistriesProvider registries={editor}>
      <HierarchyPanel lastAction={lastAction} />
    </RegistriesProvider>
  );
}

interface HierarchyPanelProps {
  readonly lastAction: MessageRef | null;
}

function HierarchyPanel({ lastAction }: HierarchyPanelProps) {
  const t = useMessages(hierarchyMessages);
  const translate = useTranslate();
  const objectContextMenu = useContextMenu(objectMenu);
  const emptySpaceContextMenu = useContextMenu(emptySpaceMenu);

  return (
    <div className={styles.root}>
      <Label tone="secondary">{lastAction === null ? t('hint') : translate(lastAction)}</Label>
      <section
        className={styles.panel}
        aria-label={t('hierarchy')}
        {...emptySpaceContextMenu.getTriggerProps(undefined)}
      >
        {SCENE_OBJECTS.map((sceneObject) => (
          <button
            key={sceneObject.name}
            type="button"
            className={styles.row}
            {...objectContextMenu.getTriggerProps(sceneObject)}
          >
            {sceneObject.name}
          </button>
        ))}
      </section>
      <ContextMenu
        context={objectMenu}
        request={objectContextMenu.request}
        onClose={objectContextMenu.close}
      />
      <ContextMenu
        context={emptySpaceMenu}
        request={emptySpaceContextMenu.request}
        onClose={emptySpaceContextMenu.close}
      />
    </div>
  );
}
