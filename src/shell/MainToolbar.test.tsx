import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineCommand } from '@/core/commands/command';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { useMessages } from '@/state/language/useMessages';
import { MainToolbar } from './MainToolbar';
import { MenuBar } from './MenuBar';
import { createTestEditor } from './testEditor';
import type { TestEditor } from './testEditor';
import { TestEditorProviders } from './TestEditorProviders';

const messages = defineMessages({
  en: {
    game: 'Game',
    play: 'Play',
    step: 'Step',
    gizmos: 'Gizmos',
    layout: 'Layout',
    resolution: 'Full HD',
  },
  ru: {
    game: 'Игра',
    play: 'Запустить',
    step: 'Шаг',
    gizmos: 'Гизмо',
    layout: 'Раскладка',
    resolution: 'Full HD',
  },
});

const play = defineCommand({
  id: 'game.play',
  label: messageRef(messages, 'play'),
  icon: frameworkIcons.refresh,
  shortcut: { keys: 'Mod+KeyP' },
});
const step = defineCommand({
  id: 'game.step',
  label: messageRef(messages, 'step'),
  icon: frameworkIcons.plus,
});
const gizmos = defineCommand({ id: 'scene.gizmos', label: messageRef(messages, 'gizmos') });
const layout = defineCommand({ id: 'window.layout', label: messageRef(messages, 'layout') });

function Resolution() {
  const t = useMessages(messages);

  return <span>{t('resolution')}</span>;
}

function setUp(): TestEditor {
  const editor = createTestEditor();
  const { toolbar } = editor.registries;
  toolbar.register({
    kind: 'command',
    id: 'step',
    zone: 'center',
    group: 0,
    order: 20,
    command: step,
  });
  toolbar.register({
    kind: 'command',
    id: 'play',
    zone: 'center',
    group: 0,
    order: 10,
    command: play,
  });
  toolbar.register({
    kind: 'command',
    id: 'gizmos',
    zone: 'left',
    group: 0,
    order: 0,
    command: gizmos,
  });
  toolbar.register({
    kind: 'command',
    id: 'layout',
    zone: 'right',
    group: 10,
    order: 0,
    command: layout,
  });
  toolbar.register({
    kind: 'component',
    id: 'resolution',
    zone: 'right',
    group: 0,
    order: 0,
    component: Resolution,
  });

  render(
    <TestEditorProviders editor={editor}>
      <MainToolbar />
    </TestEditorProviders>,
  );

  return editor;
}

function toolbarButtons(): string[] {
  return screen
    .getAllByRole('button')
    .map((button) => button.getAttribute('aria-label') ?? button.textContent);
}

afterEach(() => {
  cleanup();
});

describe('MainToolbar', () => {
  it('shows handled commands and components by zone, group and order', () => {
    const editor = setUp();
    act(() => {
      for (const command of [play, step, gizmos, layout]) {
        editor.registries.commands.handle(command, { run: vi.fn() });
      }
    });

    expect(toolbarButtons()).toEqual(['Gizmos', 'Play', 'Step', 'Layout']);
    expect(screen.getByText('Full HD')).toBeDefined();
    expect(screen.getAllByRole('separator')).toHaveLength(1);
  });

  it('hides commands without handlers and the separators around empty groups', () => {
    const editor = setUp();
    act(() => {
      editor.registries.commands.handle(play, { run: vi.fn() });
    });

    expect(toolbarButtons()).toEqual(['Play']);
    expect(screen.queryByRole('separator')).toBeNull();
  });

  it('runs a command and shows its shortcut in the tooltip', async () => {
    const user = userEvent.setup();
    const editor = setUp();
    const run = vi.fn();
    act(() => {
      editor.registries.commands.handle(play, { run });
    });

    await user.tab();

    expect(screen.getByRole('tooltip').textContent).toBe('PlayCtrl+P');

    await user.keyboard('{Enter}');

    expect(run).toHaveBeenCalledWith({ source: 'toolbar', target: undefined });
  });

  it('shows a checked command as a toggle', async () => {
    const user = userEvent.setup();
    const editor = setUp();
    let visible = true;
    act(() => {
      editor.registries.commands.handle(gizmos, {
        run: () => {
          visible = !visible;
          editor.registries.commands.refresh();
        },
        isChecked: () => visible,
      });
    });
    const toggle = screen.getByRole('button', { name: 'Gizmos' });

    expect(toggle.getAttribute('aria-pressed')).toBe('true');

    await user.click(toggle);

    expect(toggle.getAttribute('aria-pressed')).toBe('false');
  });

  it('keeps a disabled command focusable in the roving order', async () => {
    const user = userEvent.setup();
    const editor = setUp();
    const runStep = vi.fn();
    act(() => {
      editor.registries.commands.handle(play, { run: vi.fn() });
      editor.registries.commands.handle(step, { run: runStep, isEnabled: () => false });
    });

    await user.tab();
    await user.keyboard('{ArrowRight}');
    const stepButton = screen.getByRole('button', { name: 'Step' });

    expect(document.activeElement).toBe(stepButton);
    expect(stepButton.getAttribute('aria-disabled')).toBe('true');
    expect(screen.getByRole('tooltip').textContent).toBe('Step');

    await user.keyboard('{Enter}');

    expect(runStep).not.toHaveBeenCalled();
  });

  it('changes labels with the language', () => {
    const editor = setUp();
    act(() => {
      editor.registries.commands.handle(play, { run: vi.fn() });
      editor.stores.language.getState().setLanguage('ru');
    });

    expect(toolbarButtons()).toEqual(['Запустить']);
    expect(screen.getByRole('toolbar', { name: 'Панель инструментов' })).toBeDefined();
  });
});

describe('MainToolbar and MenuBar', () => {
  it('disable the same command at the same time', async () => {
    const user = userEvent.setup();
    const editor = createTestEditor();
    const { mainMenu, toolbar, commands } = editor.registries;
    let canStep = true;
    mainMenu.registerMenu({
      path: 'game',
      label: messageRef(messages, 'game'),
      group: 0,
      order: 0,
    });
    mainMenu.registerItem({ path: 'game/step', command: step, group: 0, order: 0 });
    toolbar.register({
      kind: 'command',
      id: 'step',
      zone: 'center',
      group: 0,
      order: 0,
      command: step,
    });
    commands.handle(step, { run: vi.fn(), isEnabled: () => canStep });
    render(
      <TestEditorProviders editor={editor}>
        <MenuBar />
        <MainToolbar />
      </TestEditorProviders>,
    );

    act(() => {
      canStep = false;
      commands.refresh();
    });
    await user.click(screen.getByRole('menuitem', { name: 'Game' }));

    await waitFor(() => {
      expect(screen.getByRole('menuitem', { name: 'Step' })).toHaveProperty('disabled', true);
    });
    expect(screen.getByRole('button', { name: 'Step' }).getAttribute('aria-disabled')).toBe('true');
  });
});
