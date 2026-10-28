import { useState } from 'react';
import { defineCommand } from '@/core/commands/command';
import type { CommandDefinition, CommandInvocation } from '@/core/commands/command';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import type { EditorExtension } from '@/contracts/editorExtension';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { useMessages } from '@/state/language/useMessages';
import { useTranslate } from '@/state/language/useTranslate';
import { createEditorRegistries } from '@/state/registries/editorRegistries';
import { RegistriesProvider } from '@/state/registries/RegistriesProvider';
import { useEditorRegistries } from '@/state/registries/registriesContext';
import { useCommandState } from '@/state/registries/useCommandState';
import { Button } from '@/ui/button/Button';
import { Label } from '@/ui/label/Label';
import styles from './CommandAtStartupExample.module.css';

const sceneMessages = defineMessages({
  en: {
    saveScene: 'Save scene',
    editScene: 'Change the scene',
    sceneSaved: 'All changes are saved',
    sceneChanged: 'The scene has unsaved changes',
  },
  ru: {
    saveScene: 'Сохранить сцену',
    editScene: 'Изменить сцену',
    sceneSaved: 'Все изменения сохранены',
    sceneChanged: 'В сцене есть несохранённые изменения',
  },
});

const saveScene = defineCommand({
  id: 'scene.save',
  label: messageRef(sceneMessages, 'saveScene'),
  icon: frameworkIcons.file,
  shortcut: { keys: 'Mod+KeyS' },
});

interface MockScene {
  readonly hasChanges: () => boolean;
  readonly edit: () => void;
  readonly save: () => void;
}

function createMockScene(): MockScene {
  let changed = false;

  return {
    hasChanges: () => changed,
    edit: () => {
      changed = true;
    },
    save: () => {
      changed = false;
    },
  };
}

function sceneExtension(scene: MockScene): EditorExtension {
  return (editor) =>
    editor.commands.handle(saveScene, {
      run() {
        scene.save();
        editor.commands.refresh();
      },
      isEnabled: () => scene.hasChanges(),
    });
}

function startExampleEditor() {
  const editor = createEditorRegistries();
  const scene = createMockScene();
  sceneExtension(scene)(editor);

  return { editor, scene };
}

const FROM_TOOLBAR: CommandInvocation<undefined> = { source: 'toolbar', target: undefined };

export function CommandAtStartupExample() {
  const [{ editor, scene }] = useState(startExampleEditor);

  return (
    <RegistriesProvider registries={editor}>
      <SceneControls scene={scene} />
    </RegistriesProvider>
  );
}

interface SceneControlsProps {
  readonly scene: MockScene;
}

function SceneControls({ scene }: SceneControlsProps) {
  const t = useMessages(sceneMessages);
  const { commands } = useEditorRegistries();
  const saveState = useCommandState(saveScene, FROM_TOOLBAR);

  return (
    <div className={styles.root}>
      <div className={styles.buttons}>
        <Button
          onClick={() => {
            scene.edit();
            commands.refresh();
          }}
        >
          {t('editScene')}
        </Button>
        <CommandButton command={saveScene} />
      </div>
      <Label tone="secondary">{t(saveState.enabled ? 'sceneChanged' : 'sceneSaved')}</Label>
    </div>
  );
}

interface CommandButtonProps {
  readonly command: CommandDefinition;
}

function CommandButton({ command }: CommandButtonProps) {
  const translate = useTranslate();
  const { commands } = useEditorRegistries();
  const state = useCommandState(command, FROM_TOOLBAR);

  if (!state.handled) {
    return null;
  }

  return (
    <Button
      {...(command.icon === undefined ? {} : { icon: command.icon })}
      disabled={!state.enabled}
      onClick={() => commands.execute(command, FROM_TOOLBAR)}
    >
      {translate(command.label)}
    </Button>
  );
}
