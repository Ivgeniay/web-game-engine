import { reportDevelopmentError } from '@/core/developmentError';
import type { Unsubscribe } from '@/core/unsubscribe';
import type { WindowType } from './windowType';

export interface DockWindow {
  readonly id: string;
  readonly windowType: string;
}

export interface DockAdapter {
  readonly getWindows: () => readonly DockWindow[];
  readonly getActiveWindowId: () => string | null;
  readonly addWindow: (window: DockWindow) => void;
  readonly activateWindow: (windowId: string) => void;
  readonly closeWindow: (windowId: string) => void;
  readonly subscribe: (listener: () => void) => Unsubscribe;
}

export interface Workspace {
  readonly attach: (adapter: DockAdapter) => Unsubscribe;
  readonly isAttached: () => boolean;
  readonly open: (windowType: WindowType) => string | null;
  readonly close: (windowId: string) => void;
  readonly isOpen: (windowType: WindowType) => boolean;
  readonly getWindows: () => readonly DockWindow[];
  readonly getActiveWindow: () => DockWindow | null;
  readonly requestFocus: (windowId: string) => void;
  readonly takeFocusRequest: (windowId: string) => boolean;
  readonly getVersion: () => number;
  readonly subscribe: (listener: () => void) => Unsubscribe;
}

const INSTANCE_SEPARATOR = ':';
const FIRST_INSTANCE_NUMBER = 1;
const NO_WINDOWS: readonly DockWindow[] = [];

function ignoreUnsubscribe(): void {}

function nextInstanceId(windowType: WindowType, windows: readonly DockWindow[]): string {
  const usedIds = new Set(windows.map(({ id }) => id));
  let instanceNumber = FIRST_INSTANCE_NUMBER;

  while (usedIds.has(`${windowType.id}${INSTANCE_SEPARATOR}${String(instanceNumber)}`)) {
    instanceNumber += 1;
  }

  return `${windowType.id}${INSTANCE_SEPARATOR}${String(instanceNumber)}`;
}

export function createWorkspace(): Workspace {
  const listeners = new Set<() => void>();
  let adapter: DockAdapter | null = null;
  let focusRequest: string | null = null;
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
    open(windowType) {
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
      adapter.addWindow({ id, windowType: windowType.id });
      requestFocus(id);

      return id;
    },
    close(windowId) {
      adapter?.closeWindow(windowId);
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
    getVersion: () => version,
    subscribe(listener) {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };
}
