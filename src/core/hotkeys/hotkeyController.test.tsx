import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineCommand } from '@/core/commands/command';
import type { CommandDefinition } from '@/core/commands/command';
import { createCommandRegistry } from '@/core/commands/commandRegistry';
import type { CommandRegistry } from '@/core/commands/commandRegistry';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import type { Unsubscribe } from '@/core/unsubscribe';
import { startHotkeyController } from './hotkeyController';
import { hotkeyScopeProps } from './hotkeyScope';
import type { CommandShortcut } from './shortcut';

const messages = defineMessages({
  en: { command: 'Command' },
  ru: { command: 'Команда' },
});

function command(id: string, shortcut: CommandShortcut): CommandDefinition {
  return defineCommand({ id, label: messageRef(messages, 'command'), shortcut });
}

const saveScene = command('scene.save', { keys: 'Mod+KeyS' });
const deleteObject = command('scene.delete', { keys: 'Delete' });
const deleteInHierarchy = command('hierarchy.delete', { keys: 'Delete', scope: 'hierarchy' });
const runLine = command('console.run', { keys: 'Mod+Enter', allowInTextInput: true });

const OUTSIDE = 'Outside';
const IN_HIERARCHY = 'Cube';
const FIELD = 'Name';
const CTRL_S = { key: 's', code: 'KeyS', ctrlKey: true };
const DELETE = { key: 'Delete', code: 'Delete' };

let stopController: Unsubscribe | null = null;
let globalHotkeysBlocked = false;

function start(commands: CommandRegistry): void {
  stopController = startHotkeyController({
    commands,
    target: document,
    platform: 'other',
    areGlobalHotkeysBlocked: () => globalHotkeysBlocked,
  });
}

function renderEditor() {
  render(
    <div>
      <button type="button">{OUTSIDE}</button>
      <div {...hotkeyScopeProps('hierarchy')}>
        <button type="button">{IN_HIERARCHY}</button>
        <input aria-label={FIELD} />
      </div>
    </div>,
  );
}

function button(name: string): HTMLElement {
  return screen.getByRole('button', { name });
}

afterEach(() => {
  stopController?.();
  stopController = null;
  globalHotkeysBlocked = false;
  cleanup();
});

describe('startHotkeyController', () => {
  it('runs a global command and prevents the browser action', () => {
    const commands = createCommandRegistry();
    const run = vi.fn();
    commands.handle(saveScene, { run });
    start(commands);
    renderEditor();

    const notPrevented = fireEvent.keyDown(button(OUTSIDE), CTRL_S);

    expect(notPrevented).toBe(false);
    expect(run).toHaveBeenCalledWith({ source: 'hotkey', target: undefined });
  });

  it('works in the Russian layout', () => {
    const commands = createCommandRegistry();
    const run = vi.fn();
    commands.handle(saveScene, { run });
    start(commands);
    renderEditor();

    fireEvent.keyDown(button(OUTSIDE), { key: 'ы', code: 'KeyS', ctrlKey: true });

    expect(run).toHaveBeenCalledTimes(1);
  });

  it('prefers the command of the scope that contains the focus', () => {
    const commands = createCommandRegistry();
    const deleteGlobally = vi.fn();
    const deleteFromHierarchy = vi.fn();
    commands.handle(deleteObject, { run: deleteGlobally });
    commands.handle(deleteInHierarchy, { run: deleteFromHierarchy });
    start(commands);
    renderEditor();

    fireEvent.keyDown(button(IN_HIERARCHY), DELETE);
    fireEvent.keyDown(button(OUTSIDE), DELETE);

    expect(deleteFromHierarchy).toHaveBeenCalledTimes(1);
    expect(deleteGlobally).toHaveBeenCalledTimes(1);
  });

  it('falls back to a wider scope when the narrower command is disabled', () => {
    const commands = createCommandRegistry();
    const deleteGlobally = vi.fn();
    commands.handle(deleteObject, { run: deleteGlobally });
    commands.handle(deleteInHierarchy, { run: vi.fn(), isEnabled: () => false });
    start(commands);
    renderEditor();

    fireEvent.keyDown(button(IN_HIERARCHY), DELETE);

    expect(deleteGlobally).toHaveBeenCalledTimes(1);
  });

  it('prevents the browser action of a disabled shortcut', () => {
    const commands = createCommandRegistry();
    const run = vi.fn();
    commands.handle(saveScene, { run, isEnabled: () => false });
    start(commands);
    renderEditor();

    expect(fireEvent.keyDown(button(OUTSIDE), CTRL_S)).toBe(false);
    expect(run).not.toHaveBeenCalled();
  });

  it('leaves unbound keys to the browser', () => {
    const commands = createCommandRegistry();
    start(commands);
    renderEditor();

    expect(fireEvent.keyDown(button(OUTSIDE), CTRL_S)).toBe(true);
  });

  it('keeps text input for the field', () => {
    const commands = createCommandRegistry();
    const remove = vi.fn();
    const save = vi.fn();
    const run = vi.fn();
    commands.handle(deleteInHierarchy, { run: remove });
    commands.handle(saveScene, { run: save });
    commands.handle(runLine, { run });
    start(commands);
    renderEditor();
    const field = screen.getByRole('textbox', { name: FIELD });

    expect(fireEvent.keyDown(field, DELETE)).toBe(true);
    expect(fireEvent.keyDown(field, CTRL_S)).toBe(true);
    fireEvent.keyDown(field, { key: 'Enter', code: 'Enter', ctrlKey: true });

    expect(remove).not.toHaveBeenCalled();
    expect(save).not.toHaveBeenCalled();
    expect(run).toHaveBeenCalledTimes(1);
  });

  it('ignores global shortcuts while they are blocked', () => {
    const commands = createCommandRegistry();
    const run = vi.fn();
    commands.handle(saveScene, { run });
    start(commands);
    renderEditor();
    globalHotkeysBlocked = true;

    expect(fireEvent.keyDown(button(OUTSIDE), CTRL_S)).toBe(true);
    expect(run).not.toHaveBeenCalled();
  });

  it('keeps scoped shortcuts while global ones are blocked', () => {
    const commands = createCommandRegistry();
    const run = vi.fn();
    commands.handle(deleteInHierarchy, { run });
    start(commands);
    renderEditor();
    globalHotkeysBlocked = true;

    fireEvent.keyDown(button(IN_HIERARCHY), DELETE);

    expect(run).toHaveBeenCalledTimes(1);
  });

  it('ignores events already handled by a component', () => {
    const commands = createCommandRegistry();
    const run = vi.fn();
    commands.handle(saveScene, { run });
    start(commands);
    render(
      <button
        type="button"
        onKeyDown={(event) => {
          event.preventDefault();
        }}
      >
        {OUTSIDE}
      </button>,
    );

    fireEvent.keyDown(button(OUTSIDE), CTRL_S);

    expect(run).not.toHaveBeenCalled();
  });

  it('ignores characters typed with AltGr', () => {
    const commands = createCommandRegistry();
    const run = vi.fn();
    commands.handle(command('scene.frame', { keys: 'Mod+Alt+KeyQ' }), { run });
    start(commands);
    renderEditor();

    fireEvent.keyDown(button(OUTSIDE), {
      key: '@',
      code: 'KeyQ',
      ctrlKey: true,
      altKey: true,
      modifierAltGraph: true,
    });

    expect(run).not.toHaveBeenCalled();
  });

  it('picks up handlers registered after the start', () => {
    const commands = createCommandRegistry();
    start(commands);
    renderEditor();
    const run = vi.fn();
    commands.handle(saveScene, { run });

    fireEvent.keyDown(button(OUTSIDE), CTRL_S);

    expect(run).toHaveBeenCalledTimes(1);
  });

  it('throws on a conflicting handler in development', () => {
    const commands = createCommandRegistry();
    commands.handle(saveScene, { run: vi.fn() });
    start(commands);

    expect(() =>
      commands.handle(command('scene.saveAll', { keys: 'Mod+KeyS' }), { run: vi.fn() }),
    ).toThrow('Shortcut Mod+KeyS in scope "global" is assigned to both');
  });

  it('throws on a reserved shortcut in development', () => {
    const commands = createCommandRegistry();
    start(commands);

    expect(() =>
      commands.handle(command('window.close', { keys: 'Mod+KeyW' }), { run: vi.fn() }),
    ).toThrow('Shortcut Mod+KeyW of command "window.close" is reserved');
  });

  it('stops listening when stopped', () => {
    const commands = createCommandRegistry();
    const run = vi.fn();
    commands.handle(saveScene, { run });
    start(commands);
    renderEditor();

    stopController?.();
    fireEvent.keyDown(button(OUTSIDE), CTRL_S);

    expect(run).not.toHaveBeenCalled();
  });
});
