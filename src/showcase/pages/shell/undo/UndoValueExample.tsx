import { useState } from 'react';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { redoCommand, registerUndoCommands, undoCommand } from '@/core/undo/undoCommands';
import { useNumberFieldMessages } from '@/state/fields/useNumberFieldMessages';
import { useMessages } from '@/state/language/useMessages';
import { createEditorRegistries } from '@/state/registries/editorRegistries';
import { RegistriesProvider } from '@/state/registries/RegistriesProvider';
import { useEditorRegistries } from '@/state/registries/registriesContext';
import { useCommandState } from '@/state/registries/useCommandState';
import { useRegistration } from '@/state/registries/useRegistration';
import { useUndoableValue } from '@/state/undo/useUndoableValue';
import { Button } from '@/ui/button/Button';
import { NumberField } from '@/ui/numberField/NumberField';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import styles from './UndoValueExample.module.css';

const lightMessages = defineMessages({
  en: { intensity: 'Intensity', undo: 'Undo', redo: 'Redo' },
  ru: { intensity: 'Интенсивность', undo: 'Отменить', redo: 'Повторить' },
});

const MIN_INTENSITY = 0;
const CODE = { source: 'code', target: undefined } as const;

export function UndoValueExample() {
  const [registries] = useState(createEditorRegistries);

  return (
    <RegistriesProvider registries={registries}>
      <LightEditor />
    </RegistriesProvider>
  );
}

function LightEditor() {
  const t = useMessages(lightMessages);
  const { commands } = useEditorRegistries();
  const invalidMessages = useNumberFieldMessages({ min: MIN_INTENSITY });
  const [intensity, setIntensity] = useState(1);
  const changeIntensity = useUndoableValue({
    label: messageRef(lightMessages, 'intensity'),
    read: () => intensity,
    write: setIntensity,
  });
  const canUndo = useCommandState(undoCommand, CODE).enabled;
  const canRedo = useCommandState(redoCommand, CODE).enabled;

  useRegistration((editor) => registerUndoCommands(editor.commands, editor.undo), []);

  return (
    <div className={styles.root}>
      <PropertyRow
        className={styles.row}
        label={t('intensity')}
        drag={{ value: intensity, onValueChange: changeIntensity, min: MIN_INTENSITY }}
      >
        {({ id }) => (
          <NumberField
            id={id}
            value={intensity}
            min={MIN_INTENSITY}
            invalidMessages={invalidMessages}
            onValueChange={changeIntensity}
          />
        )}
      </PropertyRow>
      <div className={styles.actions}>
        <Button
          disabled={!canUndo}
          onClick={() => {
            commands.execute(undoCommand, CODE);
          }}
        >
          {t('undo')}
        </Button>
        <Button
          disabled={!canRedo}
          onClick={() => {
            commands.execute(redoCommand, CODE);
          }}
        >
          {t('redo')}
        </Button>
      </div>
    </div>
  );
}
