import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { startHotkeyController } from '@/core/hotkeys/hotkeyController';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { registerUndoCommands } from '@/core/undo/undoCommands';
import type { Unsubscribe } from '@/core/unsubscribe';
import { createTestEditor } from '@/shell/testEditor';
import type { TestEditor } from '@/shell/testEditor';
import { TestEditorProviders } from '@/shell/TestEditorProviders';
import { TextField } from '@/ui/textField/TextField';
import { useUndoableValue } from './useUndoableValue';

const LABEL = 'Name';
const messages = defineMessages({ en: { name: 'Name' }, ru: { name: 'Имя' } });

function NameField() {
  const [name, setName] = useState('Cube');
  const onValueChange = useUndoableValue({
    label: messageRef(messages, 'name'),
    read: () => name,
    write: setName,
  });

  return <TextField aria-label={LABEL} value={name} onValueChange={onValueChange} />;
}

function field(): HTMLInputElement {
  const element = screen.getByRole('textbox', { name: LABEL });

  if (!(element instanceof HTMLInputElement)) {
    throw new Error('TextField did not render an input element');
  }

  return element;
}

let editor: TestEditor;
let stop: Unsubscribe;

beforeEach(() => {
  editor = createTestEditor();
  const { commands, undo } = editor.registries;
  const stopCommands = registerUndoCommands(commands, undo);
  const stopHotkeys = startHotkeyController({
    commands,
    target: document,
    platform: editor.platform,
    areGlobalHotkeysBlocked: () => false,
  });
  stop = () => {
    stopHotkeys();
    stopCommands();
  };
  render(
    <TestEditorProviders editor={editor}>
      <NameField />
    </TestEditorProviders>,
  );
});

afterEach(() => {
  stop();
  cleanup();
});

describe('useUndoableValue', () => {
  it('records a committed edit and undoes it with Mod+Z in the field', async () => {
    const user = userEvent.setup();

    await user.clear(field());
    await user.type(field(), 'Sphere{Enter}');

    expect(editor.registries.undo.canUndo()).toBe(true);

    await user.keyboard('{Control>}z{/Control}');

    expect(field().value).toBe('Cube');

    await user.keyboard('{Control>}{Shift>}z{/Shift}{/Control}');

    expect(field().value).toBe('Sphere');
  });

  it('leaves Mod+Z to the browser while the typing is not committed', async () => {
    const user = userEvent.setup();

    await user.type(field(), 'x{Enter}');
    await user.type(field(), 'y');
    await user.keyboard('{Control>}z{/Control}');

    expect(field().value).toBe('Cubexy');
    expect(editor.registries.undo.canRedo()).toBe(false);
  });
});
