import { useState } from 'react';
import { defineCommand } from '@/core/commands/command';
import type { EditorExtension } from '@/contracts/editorExtension';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import type { MessageRef } from '@/core/i18n/translate';
import { ConfirmDialogHost } from '@/shell/ConfirmDialogHost';
import { useMessages } from '@/state/language/useMessages';
import { useTranslate } from '@/state/language/useTranslate';
import { createEditorRegistries } from '@/state/registries/editorRegistries';
import { RegistriesProvider } from '@/state/registries/RegistriesProvider';
import { useEditorRegistries } from '@/state/registries/registriesContext';
import { Button } from '@/ui/button/Button';
import { Label } from '@/ui/label/Label';
import styles from './ConfirmDialogExample.module.css';

const sceneMessages = defineMessages({
  en: {
    deleteObjects: 'Delete selected objects',
    deleteTitle: {
      one: 'Delete {count} object?',
      other: 'Delete {count} objects?',
    },
    deleteMessage: 'Scripts that refer to them will lose the references.',
    delete: 'Delete',
    deleted: 'Objects deleted',
    kept: 'Objects kept',
  },
  ru: {
    deleteObjects: 'Удалить выделенные объекты',
    deleteTitle: {
      one: 'Удалить {count} объект?',
      few: 'Удалить {count} объекта?',
      many: 'Удалить {count} объектов?',
      other: 'Удалить {count} объекта?',
    },
    deleteMessage: 'Скрипты, которые ссылаются на них, потеряют ссылки.',
    delete: 'Удалить',
    deleted: 'Объекты удалены',
    kept: 'Объекты оставлены',
  },
});

const SELECTED_COUNT = 3;

const deleteSelection = defineCommand({
  id: 'scene.deleteSelection',
  label: messageRef(sceneMessages, 'deleteObjects'),
  shortcut: { keys: 'Delete' },
});

function sceneExtension(report: (result: MessageRef) => void): EditorExtension {
  return ({ commands, dialogs }) =>
    commands.handle(deleteSelection, {
      async run() {
        const answer = await dialogs.confirm({
          title: messageRef(sceneMessages, 'deleteTitle', { count: SELECTED_COUNT }),
          message: messageRef(sceneMessages, 'deleteMessage'),
          confirmLabel: messageRef(sceneMessages, 'delete'),
          destructive: true,
        });

        report(messageRef(sceneMessages, answer === 'confirm' ? 'deleted' : 'kept'));
      },
    });
}

export function ConfirmDialogExample() {
  const [result, setResult] = useState<MessageRef | null>(null);
  const [editor] = useState(() => {
    const registries = createEditorRegistries();
    sceneExtension(setResult)(registries);

    return registries;
  });

  return (
    <RegistriesProvider registries={editor}>
      <SceneActions result={result} />
      <ConfirmDialogHost />
    </RegistriesProvider>
  );
}

interface SceneActionsProps {
  readonly result: MessageRef | null;
}

function SceneActions({ result }: SceneActionsProps) {
  const t = useMessages(sceneMessages);
  const translate = useTranslate();
  const { commands } = useEditorRegistries();

  return (
    <div className={styles.root}>
      <Button
        onClick={() => {
          commands.execute(deleteSelection, { source: 'code', target: undefined });
        }}
      >
        {t('deleteObjects')}
      </Button>
      <Label tone="secondary">{result === null ? '' : translate(result)}</Label>
    </div>
  );
}
