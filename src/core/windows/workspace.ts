import { reportDevelopmentError } from '@/core/developmentError';
import type { LayoutNode } from '@/core/layout/layoutDescription';
import type { Unsubscribe } from '@/core/unsubscribe';
import type { WindowType } from './windowType';

export interface DockWindow {
  readonly id: string;
  readonly windowType: string;
}

export interface OpenWindowOptions {
  readonly besideWindow?: string | undefined;
}

export type TabStep = 1 | -1;

export interface DockAdapter {
  readonly getWindows: () => readonly DockWindow[];
  readonly getActiveWindowId: () => string | null;
  readonly getGroupWindowIds: (windowId: string) => readonly string[];
  readonly addWindow: (window: DockWindow, besideWindow: string | null) => void;
  readonly activateWindow: (windowId: string) => void;
  readonly closeWindow: (windowId: string) => void;
  readonly applyLayout: (layout: LayoutNode) => void;
  readonly maximizeWindow: (windowId: string) => void;
  readonly restoreMaximized: () => void;
  readonly isMaximized: () => boolean;
  readonly subscribe: (listener: () => void) => Unsubscribe;
}

export interface Workspace {
  readonly attach: (adapter: DockAdapter) => Unsubscribe;
  readonly isAttached: () => boolean;
  readonly open: (windowType: WindowType, options?: OpenWindowOptions) => string | null;
  readonly activateAdjacentTab: (step: TabStep) => boolean;
  readonly close: (windowId: string) => void;
  readonly isOpen: (windowType: WindowType) => boolean;
  readonly getWindows: () => readonly DockWindow[];
  readonly getActiveWindow: () => DockWindow | null;
  readonly requestFocus: (windowId: string) => void;
  readonly takeFocusRequest: (windowId: string) => boolean;
  readonly setDefaultLayout: (layout: LayoutNode) => Unsubscribe;
  readonly getDefaultLayout: () => LayoutNode | null;
  readonly resetLayout: () => boolean;
  readonly maximize: (windowId: string) => void;
  readonly restore: () => void;
  readonly isMaximized: () => boolean;
  readonly getVersion: () => number;
  readonly subscribe: (listener: () => void) => Unsubscribe;
}

const INSTANCE_SEPARATOR = ':';
const FIRST_INSTANCE_NUMBER = 1;
const NO_WINDOWS: readonly DockWindow[] = [];

function ignoreUnsubscribe(): void {}

export function windowInstanceId(windowType: string, instanceNumber: number): string {
  return `${windowType}${INSTANCE_SEPARATOR}${String(instanceNumber)}`;
}

function nextInstanceId(windowType: WindowType, windows: readonly DockWindow[]): string {
  const usedIds = new Set(windows.map(({ id }) => id));
  let instanceNumber = FIRST_INSTANCE_NUMBER;

  while (usedIds.has(windowInstanceId(windowType.id, instanceNumber))) {
    instanceNumber += 1;
  }

  return windowInstanceId(windowType.id, instanceNumber);
}

export function createWorkspace(): Workspace {
  const listeners = new Set<() => void>();
  let adapter: DockAdapter | null = null;
  let focusRequest: string | null = null;
  let defaultLayout: LayoutNode | null = null;
  let version = 0;

  function changed(): void {
    version += 1;

    for (const listener of [...listeners]) {
      listener();
    }
  }

  function getWindows(): readonly DockWindow[] {
    return adapter?.getWindows() ?? NO_WINDOWS;
  }

  function windowsOfType(windowType: WindowType): readonly DockWindow[] {
    return getWindows().filter((window) => window.windowType === windowType.id);
  }

  function requestFocus(windowId: string): void {
    focusRequest = windowId;
    changed();
  }

  return {
    attach(nextAdapter) {
      if (adapter !== null) {
        reportDevelopmentError(
          'Workspace already has a dock layout. Render one DockLayout per editor.',
        );
        return ignoreUnsubscribe;
      }

      adapter = nextAdapter;
      const unsubscribeAdapter = nextAdapter.subscribe(changed);
      changed();

      return () => {
        if (adapter !== nextAdapter) {
          return;
        }

        unsubscribeAdapter();
        adapter = null;
        focusRequest = null;
        changed();
      };
    },
    isAttached: () => adapter !== null,
    open(windowType, { besideWindow } = {}) {
      if (adapter === null) {
        return null;
      }

      const [existing] = windowsOfType(windowType);

      if (existing !== undefined && !windowType.multiInstance) {
        adapter.activateWindow(existing.id);
        requestFocus(existing.id);
        return existing.id;
      }

      const id = windowType.multiInstance
        ? nextInstanceId(windowType, getWindows())
        : windowType.id;
      adapter.addWindow({ id, windowType: windowType.id }, besideWindow ?? null);
      requestFocus(id);

      return id;
    },
    close(windowId) {
      adapter?.closeWindow(windowId);
    },
    activateAdjacentTab(step) {
      const activeId = adapter?.getActiveWindowId() ?? null;

      if (adapter === null || activeId === null) {
        return false;
      }

      const groupIds = adapter.getGroupWindowIds(activeId);
      const index = groupIds.indexOf(activeId);
      const nextId = groupIds[(index + step + groupIds.length) % groupIds.length];

      if (nextId === undefined || nextId === activeId) {
        return false;
      }

      adapter.activateWindow(nextId);
      requestFocus(nextId);
      return true;
    },
    isOpen: (windowType) => windowsOfType(windowType).length > 0,
    getWindows,
    getActiveWindow() {
      const activeId = adapter?.getActiveWindowId() ?? null;

      return getWindows().find(({ id }) => id === activeId) ?? null;
    },
    requestFocus,
    takeFocusRequest(windowId) {
      if (focusRequest !== windowId) {
        return false;
      }

      focusRequest = null;
      return true;
    },
    setDefaultLayout(layout) {
      if (defaultLayout !== null) {
        reportDevelopmentError('Default layout is already set. Set it once per editor.');
        return ignoreUnsubscribe;
      }

      defaultLayout = layout;
      changed();

      return () => {
        if (defaultLayout !== layout) {
          return;
        }

        defaultLayout = null;
        changed();
      };
    },
    getDefaultLayout: () => defaultLayout,
    resetLayout() {
      if (adapter === null || defaultLayout === null) {
        return false;
      }

      adapter.applyLayout(defaultLayout);
      return true;
    },
    maximize(windowId) {
      adapter?.maximizeWindow(windowId);
    },
    restore() {
      adapter?.restoreMaximized();
    },
    isMaximized: () => adapter?.isMaximized() ?? false,
    getVersion: () => version,
    subscribe(listener) {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };
}
