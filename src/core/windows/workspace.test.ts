import { describe, expect, it, vi } from 'vitest';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import type { DockAdapter, DockWindow } from './workspace';
import { createWorkspace } from './workspace';
import { defineWindow } from './windowType';

const messages = defineMessages({
  en: { scene: 'Scene', inspector: 'Inspector' },
  ru: { scene: 'Сцена', inspector: 'Инспектор' },
});

function EmptyWindow() {
  return null;
}

const sceneWindow = defineWindow({
  id: 'test.scene',
  title: messageRef(messages, 'scene'),
  component: EmptyWindow,
});

const inspectorWindow = defineWindow({
  id: 'test.inspector',
  title: messageRef(messages, 'inspector'),
  component: EmptyWindow,
  multiInstance: true,
});

interface FakeDock extends DockAdapter {
  readonly emit: () => void;
}

function createFakeDock(initial: readonly DockWindow[] = []): FakeDock {
  let windows = [...initial];
  let activeId: string | null = windows.at(-1)?.id ?? null;
  const listeners = new Set<() => void>();

  function emit(): void {
    for (const listener of listeners) {
      listener();
    }
  }

  return {
    getWindows: () => windows,
    getActiveWindowId: () => activeId,
    addWindow(window) {
      windows = [...windows, window];
      activeId = window.id;
      emit();
    },
    activateWindow(windowId) {
      activeId = windowId;
      emit();
    },
    closeWindow(windowId) {
      windows = windows.filter(({ id }) => id !== windowId);
      activeId = windows.at(-1)?.id ?? null;
      emit();
    },
    subscribe(listener) {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
    emit,
  };
}

describe('createWorkspace', () => {
  it('does nothing until a dock layout is attached', () => {
    const workspace = createWorkspace();

    expect(workspace.isAttached()).toBe(false);
    expect(workspace.open(sceneWindow)).toBeNull();
    expect(workspace.isOpen(sceneWindow)).toBe(false);
    expect(workspace.getActiveWindow()).toBeNull();
  });

  it('opens a single-instance window under the id of its type', () => {
    const workspace = createWorkspace();
    workspace.attach(createFakeDock());

    expect(workspace.open(sceneWindow)).toBe('test.scene');
    expect(workspace.isOpen(sceneWindow)).toBe(true);
    expect(workspace.getActiveWindow()).toEqual({ id: 'test.scene', windowType: 'test.scene' });
  });

  it('activates an open single-instance window instead of opening another', () => {
    const workspace = createWorkspace();
    const dock = createFakeDock([
      { id: 'test.scene', windowType: 'test.scene' },
      { id: 'test.inspector:1', windowType: 'test.inspector' },
    ]);
    workspace.attach(dock);

    expect(workspace.open(sceneWindow)).toBe('test.scene');
    expect(dock.getWindows()).toHaveLength(2);
    expect(workspace.getActiveWindow()?.id).toBe('test.scene');
  });

  it('numbers instances of a multi-instance window with the smallest free number', () => {
    const workspace = createWorkspace();
    workspace.attach(createFakeDock([{ id: 'test.inspector:2', windowType: 'test.inspector' }]));

    expect(workspace.open(inspectorWindow)).toBe('test.inspector:1');
    expect(workspace.open(inspectorWindow)).toBe('test.inspector:3');
  });

  it('closes a window', () => {
    const workspace = createWorkspace();
    workspace.attach(createFakeDock([{ id: 'test.scene', windowType: 'test.scene' }]));
    workspace.close('test.scene');

    expect(workspace.isOpen(sceneWindow)).toBe(false);
  });

  it('hands a focus request to the opened window once', () => {
    const workspace = createWorkspace();
    workspace.attach(createFakeDock());
    workspace.open(sceneWindow);

    expect(workspace.takeFocusRequest('test.inspector:1')).toBe(false);
    expect(workspace.takeFocusRequest('test.scene')).toBe(true);
    expect(workspace.takeFocusRequest('test.scene')).toBe(false);
  });

  it('notifies listeners about attaching and dock changes', () => {
    const workspace = createWorkspace();
    const dock = createFakeDock();
    const listener = vi.fn();
    workspace.subscribe(listener);
    const detach = workspace.attach(dock);
    dock.emit();
    detach();
    dock.emit();

    expect(listener).toHaveBeenCalledTimes(3);
    expect(workspace.isAttached()).toBe(false);
  });

  it('reports a second dock layout as a development error', () => {
    const workspace = createWorkspace();
    workspace.attach(createFakeDock());

    expect(() => workspace.attach(createFakeDock())).toThrow(/already has a dock layout/);
  });

  it('keeps the current dock when a stale detach runs', () => {
    const workspace = createWorkspace();
    const detachFirst = workspace.attach(createFakeDock());
    detachFirst();
    workspace.attach(createFakeDock());
    detachFirst();

    expect(workspace.isAttached()).toBe(true);
  });
});
