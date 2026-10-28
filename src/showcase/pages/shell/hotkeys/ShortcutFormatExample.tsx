import { defineCommand } from '@/core/commands/command';
import type { CommandDefinition } from '@/core/commands/command';
import { formatShortcut } from '@/core/hotkeys/formatShortcut';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { useMessages } from '@/state/language/useMessages';
import { useTranslate } from '@/state/language/useTranslate';
import { useFormatShortcut } from '@/state/platform/useFormatShortcut';
import { Kbd } from '@/ui/kbd/Kbd';
import { Label } from '@/ui/label/Label';
import styles from './ShortcutFormatExample.module.css';

const editMessages = defineMessages({
  en: {
    command: 'Command',
    mac: 'macOS',
    other: 'Windows and Linux',
    current: 'This computer',
    save: 'Save scene',
    redo: 'Redo',
    duplicate: 'Duplicate',
    frame: 'Frame selected',
    nudge: 'Move up',
  },
  ru: {
    command: 'Команда',
    mac: 'macOS',
    other: 'Windows и Linux',
    current: 'Этот компьютер',
    save: 'Сохранить сцену',
    redo: 'Повторить',
    duplicate: 'Дублировать',
    frame: 'Показать выделенное',
    nudge: 'Сдвинуть вверх',
  },
});

const COMMANDS: readonly CommandDefinition[] = [
  defineCommand({
    id: 'scene.save',
    label: messageRef(editMessages, 'save'),
    shortcut: { keys: 'Mod+KeyS' },
  }),
  defineCommand({
    id: 'edit.redo',
    label: messageRef(editMessages, 'redo'),
    shortcut: { keys: 'Mod+Shift+KeyZ' },
  }),
  defineCommand({
    id: 'edit.duplicate',
    label: messageRef(editMessages, 'duplicate'),
    shortcut: { keys: 'Mod+KeyD' },
  }),
  defineCommand({
    id: 'scene.frame',
    label: messageRef(editMessages, 'frame'),
    shortcut: { keys: 'KeyF', scope: 'scene' },
  }),
  defineCommand({
    id: 'scene.nudge',
    label: messageRef(editMessages, 'nudge'),
    shortcut: { keys: 'Alt+Shift+ArrowUp', scope: 'scene' },
  }),
];

export function ShortcutFormatExample() {
  const t = useMessages(editMessages);

  return (
    <div className={styles.root}>
      <Label tone="secondary">{t('command')}</Label>
      <Label tone="secondary">{t('mac')}</Label>
      <Label tone="secondary">{t('other')}</Label>
      <Label tone="secondary">{t('current')}</Label>
      {COMMANDS.map((command) => (
        <ShortcutRow key={command.id} command={command} />
      ))}
    </div>
  );
}

interface ShortcutRowProps {
  readonly command: CommandDefinition;
}

function ShortcutRow({ command }: ShortcutRowProps) {
  const translate = useTranslate();
  const format = useFormatShortcut();
  const keys = command.shortcut?.keys;

  if (keys === undefined) {
    return null;
  }

  return (
    <>
      <Label>{translate(command.label)}</Label>
      <Kbd>{formatShortcut(keys, 'mac')}</Kbd>
      <Kbd>{formatShortcut(keys, 'other')}</Kbd>
      <Kbd tone="primary">{format(keys)}</Kbd>
    </>
  );
}
