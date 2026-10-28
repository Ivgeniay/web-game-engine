import { useEffect, useRef, useState } from 'react';
import { defineCommand } from '@/core/commands/command';
import type { CommandDefinition } from '@/core/commands/command';
import { startHotkeyController } from '@/core/hotkeys/hotkeyController';
import { hotkeyScopeProps } from '@/core/hotkeys/hotkeyScope';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import type { MessageRef } from '@/core/i18n/translate';
import { combineUnsubscribes } from '@/core/unsubscribe';
import { isKeyboardCapturedByPopup } from '@/shell/popupKeyboardCapture';
import { useMessages } from '@/state/language/useMessages';
import { useTranslate } from '@/state/language/useTranslate';
import { usePlatform } from '@/state/platform/platformContext';
import { useFormatShortcut } from '@/state/platform/useFormatShortcut';
import { createEditorRegistries } from '@/state/registries/editorRegistries';
import { RegistriesProvider } from '@/state/registries/RegistriesProvider';
import { useRegistration } from '@/state/registries/useRegistration';
import { Kbd } from '@/ui/kbd/Kbd';
import { Label } from '@/ui/label/Label';
import styles from './HotkeyScopesExample.module.css';

const exampleMessages = defineMessages({
  en: {
    scene: 'Scene',
    hierarchy: 'Hierarchy',
    console: 'Console line',
    deleteFromScene: 'Delete from the scene',
    deleteFromHierarchy: 'Delete from Hierarchy',
    runLine: 'Run the line',
    hint: 'Click an area or the field and press a shortcut',
    lastCommand: 'Last command: {name}',
    noCommand: 'No command yet',
  },
  ru: {
    scene: 'Сцена',
    hierarchy: 'Hierarchy',
    console: 'Строка консоли',
    deleteFromScene: 'Удалить из сцены',
    deleteFromHierarchy: 'Удалить из Hierarchy',
    runLine: 'Выполнить строку',
    hint: 'Щёлкните по области или полю и нажмите сочетание',
    lastCommand: 'Последняя команда: {name}',
    noCommand: 'Команд ещё не было',
  },
});

const HIERARCHY_SCOPE = 'hierarchy';

const deleteFromScene = defineCommand({
  id: 'scene.delete',
  label: messageRef(exampleMessages, 'deleteFromScene'),
  shortcut: { keys: 'Delete' },
});

const deleteFromHierarchy = defineCommand({
  id: 'hierarchy.delete',
  label: messageRef(exampleMessages, 'deleteFromHierarchy'),
  shortcut: { keys: 'Delete', scope: HIERARCHY_SCOPE },
});

const runLine = defineCommand({
  id: 'console.run',
  label: messageRef(exampleMessages, 'runLine'),
  shortcut: { keys: 'Mod+Enter', allowInTextInput: true },
});

const EXAMPLE_COMMANDS: readonly CommandDefinition[] = [
  deleteFromScene,
  deleteFromHierarchy,
  runLine,
];

export function HotkeyScopesExample() {
  const [editor] = useState(createEditorRegistries);
  const platform = usePlatform();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (root === null) {
      return undefined;
    }

    return startHotkeyController({
      commands: editor.commands,
      target: root,
      platform,
      areGlobalHotkeysBlocked: () => isKeyboardCapturedByPopup(document),
    });
  }, [editor, platform]);

  return (
    <RegistriesProvider registries={editor}>
      <div ref={rootRef}>
        <ExampleEditor />
      </div>
    </RegistriesProvider>
  );
}

function ExampleEditor() {
  const t = useMessages(exampleMessages);
  const translate = useTranslate();
  const [lastCommand, setLastCommand] = useState<MessageRef | null>(null);

  useRegistration(
    (editor) =>
      combineUnsubscribes(
        ...EXAMPLE_COMMANDS.map((command) =>
          editor.commands.handle(command, {
            run() {
              setLastCommand(command.label);
            },
          }),
        ),
      ),
    [],
  );

  return (
    <div className={styles.root}>
      <Label tone="secondary">{t('hint')}</Label>
      <div className={styles.areas}>
        <section className={styles.area} tabIndex={0} aria-label={t('scene')}>
          <Label>{t('scene')}</Label>
          <ShortcutHint command={deleteFromScene} />
        </section>
        <section
          className={styles.area}
          tabIndex={0}
          aria-label={t('hierarchy')}
          {...hotkeyScopeProps(HIERARCHY_SCOPE)}
        >
          <Label>{t('hierarchy')}</Label>
          <ShortcutHint command={deleteFromHierarchy} />
        </section>
      </div>
      <input className={styles.field} aria-label={t('console')} placeholder={t('console')} />
      <ShortcutHint command={runLine} />
      <Label tone="secondary">
        {lastCommand === null ? t('noCommand') : t('lastCommand', { name: translate(lastCommand) })}
      </Label>
    </div>
  );
}

interface ShortcutHintProps {
  readonly command: CommandDefinition;
}

function ShortcutHint({ command }: ShortcutHintProps) {
  const translate = useTranslate();
  const format = useFormatShortcut();
  const keys = command.shortcut?.keys;

  return (
    <span className={styles.hint}>
      <Label tone="secondary">{translate(command.label)}</Label>
      {keys !== undefined && <Kbd>{format(keys)}</Kbd>}
    </span>
  );
}
