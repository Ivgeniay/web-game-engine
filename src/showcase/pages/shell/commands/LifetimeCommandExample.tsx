import { useState } from 'react';
import { defineCommand } from '@/core/commands/command';
import type { CommandDefinition, CommandInvocation } from '@/core/commands/command';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { useMessages } from '@/state/language/useMessages';
import { useTranslate } from '@/state/language/useTranslate';
import { createEditorRegistries } from '@/state/registries/editorRegistries';
import { RegistriesProvider } from '@/state/registries/RegistriesProvider';
import { useEditorRegistries } from '@/state/registries/registriesContext';
import { useCommandState } from '@/state/registries/useCommandState';
import { useRegistration } from '@/state/registries/useRegistration';
import { Checkbox } from '@/ui/checkbox/Checkbox';
import { Label } from '@/ui/label/Label';
import { ToggleButton } from '@/ui/toggleButton/ToggleButton';
import styles from './LifetimeCommandExample.module.css';

const inspectorMessages = defineMessages({
  en: {
    showInspector: 'Show the Inspector window',
    lockInspector: 'Lock Inspector',
    locked: 'Inspector is locked on the current selection',
    unlocked: 'Inspector follows the selection',
    noHandler: 'The command has no handler: the button is hidden',
  },
  ru: {
    showInspector: 'Показать окно Inspector',
    lockInspector: 'Закрепить Inspector',
    locked: 'Inspector закреплён на текущем выделении',
    unlocked: 'Inspector следует за выделением',
    noHandler: 'У команды нет обработчика: кнопка скрыта',
  },
});

const lockInspector = defineCommand({
  id: 'inspector.lock',
  label: messageRef(inspectorMessages, 'lockInspector'),
  icon: frameworkIcons.lock,
});

const FROM_TOOLBAR: CommandInvocation<undefined> = { source: 'toolbar', target: undefined };

export function LifetimeCommandExample() {
  const [editor] = useState(createEditorRegistries);
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const t = useMessages(inspectorMessages);

  return (
    <RegistriesProvider registries={editor}>
      <div className={styles.root}>
        <Checkbox
          checked={inspectorOpen}
          onCheckedChange={setInspectorOpen}
          label={t('showInspector')}
        />
        <CommandToggle command={lockInspector} />
        {inspectorOpen ? <InspectorWindow /> : <Label tone="secondary">{t('noHandler')}</Label>}
      </div>
    </RegistriesProvider>
  );
}

function InspectorWindow() {
  const t = useMessages(inspectorMessages);
  const [locked, setLocked] = useState(false);

  useRegistration(
    (editor) =>
      editor.commands.handle(lockInspector, {
        run: () => {
          setLocked(!locked);
        },
        isChecked: () => locked,
      }),
    [locked],
  );

  return (
    <div className={styles.window}>
      <Label>{t(locked ? 'locked' : 'unlocked')}</Label>
    </div>
  );
}

interface CommandToggleProps {
  readonly command: CommandDefinition;
}

function CommandToggle({ command }: CommandToggleProps) {
  const translate = useTranslate();
  const { commands } = useEditorRegistries();
  const state = useCommandState(command, FROM_TOOLBAR);

  if (!state.handled) {
    return null;
  }

  return (
    <ToggleButton
      {...(command.icon === undefined ? {} : { icon: command.icon })}
      pressed={state.checked ?? false}
      disabled={!state.enabled}
      onPressedChange={() => commands.execute(command, FROM_TOOLBAR)}
    >
      {translate(command.label)}
    </ToggleButton>
  );
}
