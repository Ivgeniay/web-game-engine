import { useState } from 'react';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import type { ConfirmAnswer } from '@/state/dialogs/confirmDialogStore';
import { ConfirmDialogHost } from '@/shell/ConfirmDialogHost';
import { useMessages } from '@/state/language/useMessages';
import { createEditorRegistries } from '@/state/registries/editorRegistries';
import { RegistriesProvider } from '@/state/registries/RegistriesProvider';
import { useEditorRegistries } from '@/state/registries/registriesContext';
import { Button } from '@/ui/button/Button';
import { Label } from '@/ui/label/Label';
import styles from './ConfirmQueueExample.module.css';

const projectMessages = defineMessages({
  en: {
    closeProject: 'Close the project',
    saveSceneTitle: 'Save changes in the scene?',
    savePrefabTitle: 'Save changes in the prefab?',
    save: 'Save',
    dontSave: "Don't save",
    answers: 'Scene: {scene}, prefab: {prefab}',
    confirm: 'save',
    cancel: 'discard',
  },
  ru: {
    closeProject: 'Закрыть проект',
    saveSceneTitle: 'Сохранить изменения в сцене?',
    savePrefabTitle: 'Сохранить изменения в префабе?',
    save: 'Сохранить',
    dontSave: 'Не сохранять',
    answers: 'Сцена: {scene}, префаб: {prefab}',
    confirm: 'сохранить',
    cancel: 'не сохранять',
  },
});

interface Answers {
  readonly scene: ConfirmAnswer;
  readonly prefab: ConfirmAnswer;
}

export function ConfirmQueueExample() {
  const [editor] = useState(createEditorRegistries);

  return (
    <RegistriesProvider registries={editor}>
      <CloseProject />
      <ConfirmDialogHost />
    </RegistriesProvider>
  );
}

function CloseProject() {
  const t = useMessages(projectMessages);
  const { dialogs } = useEditorRegistries();
  const [answers, setAnswers] = useState<Answers | null>(null);

  async function closeProject(): Promise<void> {
    const common = {
      confirmLabel: messageRef(projectMessages, 'save'),
      cancelLabel: messageRef(projectMessages, 'dontSave'),
    };
    const [scene, prefab] = await Promise.all([
      dialogs.confirm({ ...common, title: messageRef(projectMessages, 'saveSceneTitle') }),
      dialogs.confirm({ ...common, title: messageRef(projectMessages, 'savePrefabTitle') }),
    ]);

    setAnswers({ scene, prefab });
  }

  return (
    <div className={styles.root}>
      <Button
        onClick={() => {
          void closeProject();
        }}
      >
        {t('closeProject')}
      </Button>
      <Label tone="secondary">
        {answers === null
          ? ''
          : t('answers', { scene: t(answers.scene), prefab: t(answers.prefab) })}
      </Label>
    </div>
  );
}
