import { act, cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { defineMessages } from '@/core/i18n/messages';
import { useMessages } from '@/state/language/useMessages';
import { StatusBar } from './StatusBar';
import { createTestEditor } from './testEditor';
import { TestEditorProviders } from './TestEditorProviders';

const messages = defineMessages({
  en: { scene: 'Main scene', fps: '60 FPS', compiling: 'Compiling' },
  ru: { scene: 'Главная сцена', fps: '60 FPS', compiling: 'Компиляция' },
});

function SceneName() {
  return <span>{useMessages(messages)('scene')}</span>;
}

function Fps() {
  return <span>{useMessages(messages)('fps')}</span>;
}

function Compiling() {
  return <span>{useMessages(messages)('compiling')}</span>;
}

afterEach(() => {
  cleanup();
});

describe('StatusBar', () => {
  it('shows the items of each zone by order', () => {
    const editor = createTestEditor();
    const { statusBar } = editor.registries;
    statusBar.register({ id: 'fps', zone: 'right', order: 20, component: Fps });
    statusBar.register({ id: 'scene', zone: 'left', order: 0, component: SceneName });
    statusBar.register({ id: 'compiling', zone: 'right', order: 10, component: Compiling });
    render(
      <TestEditorProviders editor={editor}>
        <StatusBar />
      </TestEditorProviders>,
    );

    const bar = screen.getByRole('contentinfo', { name: 'Status bar' });

    expect(bar.textContent).toBe('Main sceneCompiling60 FPS');
  });

  it('announces only the items that ask for it', () => {
    const editor = createTestEditor();
    const { statusBar } = editor.registries;
    statusBar.register({ id: 'scene', zone: 'left', order: 0, component: SceneName });
    statusBar.register({
      id: 'compiling',
      zone: 'right',
      order: 0,
      component: Compiling,
      announce: true,
    });
    render(
      <TestEditorProviders editor={editor}>
        <StatusBar />
      </TestEditorProviders>,
    );

    const [status] = screen.getAllByRole('status');

    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(status === undefined ? null : within(status).getByText('Compiling')).not.toBeNull();
  });

  it('follows registrations made after the first render', () => {
    const editor = createTestEditor();
    render(
      <TestEditorProviders editor={editor}>
        <StatusBar />
      </TestEditorProviders>,
    );

    let unregister = (): void => undefined;
    act(() => {
      unregister = editor.registries.statusBar.register({
        id: 'fps',
        zone: 'right',
        order: 0,
        component: Fps,
      });
    });

    expect(screen.getByText('60 FPS')).toBeDefined();

    act(() => {
      unregister();
    });

    expect(screen.queryByText('60 FPS')).toBeNull();
  });
});
