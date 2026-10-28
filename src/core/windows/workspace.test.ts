import { describe, expect, it, vi } from 'vitest';
import { defineMessages } from '@/core/i18n/messages';
import { tabsLayout } from '@/core/layout/layoutDescription';
import type { LayoutNode } from '@/core/layout/layoutDescription';
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
  readonly getAppliedLayout: () => LayoutNode | null;
  readonly getMaximizedId: () => string | null;
  readonly getAddedBeside: () => string | null;
}

function createFakeDock(initial: readonly DockWindow[] = []): FakeDock {
  let windows = [...initial];
  let activeId: string | null = windows.at(-1)?.id ?? null;
  let appliedLayout: LayoutNode | null = null;
  let maximizedId: string | null = null;
  let addedBeside: string | null = null;
  const listeners = new Set<() => void>();

  function emit(): void {
    for (const listener of listeners) {
      listener();
    }
  }

  return {
    getWindows: () => windows,
    getActiveWindowId: () => activeId,
    getGroupWindowIds: () => windows.map(({ id }) => id),
    addWindow(window, besideWindow) {
      addedBeside = besideWindow;
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
    applyLayout(layout) {
      appliedLayout = layout;
      emit();
    },
    maximizeWindow(windowId) {
      maximizedId = windowId;
      emit();
    },
    restoreMaximized() {
      maximizedId = null;
      emit();
    },
    isMaximized: () => maximizedId !== null,
    subscribe(listener) {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
    emit,
    getAppliedLayout: () => appliedLayout,
    getMaximizedId: () => maximizedId,
    getAddedBeside: () => addedBeside,
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

  it('resets to the default layout only when one is set and a dock is attached', () => {
    const workspace = createWorkspace();
    const dock = createFakeDock();
    const layout = tabsLayout([sceneWindow]);

    expect(workspace.resetLayout()).toBe(false);

    workspace.setDefaultLayout(layout);

    expect(workspace.resetLayout()).toBe(false);

    workspace.attach(dock);

    expect(workspace.resetLayout()).toBe(true);
    expect(dock.getAppliedLayout()).toBe(layout);
  });

  it('forgets the default layout when its registration is cancelled', () => {
    const workspace = createWorkspace();
    const cancel = workspace.setDefaultLayout(tabsLayout([sceneWindow]));
    cancel();

    expect(workspace.getDefaultLayout()).toBeNull();
  });

  it('reports a second default layout as a development error', () => {
    const workspace = createWorkspace();
    workspace.setDefaultLayout(tabsLayout([sceneWindow]));

    expect(() => workspace.setDefaultLayout(tabsLayout([inspectorWindow]))).toThrow(
      /Default layout is already set/,
    );
  });

  it('maximizes a window and restores it', () => {
    const workspace = createWorkspace();
    const dock = createFakeDock([{ id: 'test.scene', windowType: 'test.scene' }]);
    workspace.attach(dock);
    workspace.maximize('test.scene');

    expect(workspace.isMaximized()).toBe(true);
    expect(dock.getMaximizedId()).toBe('test.scene');

    workspace.restore();

    expect(workspace.isMaximized()).toBe(false);
  });

  it('opens a window beside another one', () => {
    const workspace = createWorkspace();
    const dock = createFakeDock([{ id: 'test.scene', windowType: 'test.scene' }]);
    workspace.attach(dock);
    workspace.open(inspectorWindow, { besideWindow: 'test.scene' });

    expect(dock.getAddedBeside()).toBe('test.scene');
  });

  it('activates the neighbouring tab of the group in a circle and focuses it', () => {
    const workspace = createWorkspace();
    workspace.attach(
      createFakeDock([
        { id: 'test.scene', windowType: 'test.scene' },
        { id: 'test.inspector:1', windowType: 'test.inspector' },
        { id: 'test.inspector:2', windowType: 'test.inspector' },
      ]),
    );

    expect(workspace.activateAdjacentTab(1)).toBe(true);
    expect(workspace.getActiveWindow()?.id).toBe('test.scene');
    expect(workspace.takeFocusRequest('test.scene')).toBe(true);
    expect(workspace.activateAdjacentTab(-1)).toBe(true);
    expect(workspace.getActiveWindow()?.id).toBe('test.inspector:2');
  });

  it('does not switch tabs in a group of one window', () => {
    const workspace = createWorkspace();
    workspace.attach(createFakeDock([{ id: 'test.scene', windowType: 'test.scene' }]));

    expect(workspace.activateAdjacentTab(1)).toBe(false);
  });
});
