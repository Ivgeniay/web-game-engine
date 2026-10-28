import type { DockviewApi, IDockviewPanel } from 'dockview-react';
import type { DockAdapter, DockWindow } from '@/core/windows/workspace';

export const WINDOW_PANEL_COMPONENT = 'editor-window';

export function windowTypeOfParams(params: unknown): string | null {
  if (typeof params !== 'object' || params === null || !('windowType' in params)) {
    return null;
  }

  const { windowType } = params;

  return typeof windowType === 'string' ? windowType : null;
}

function dockWindowsOf(panel: IDockviewPanel): DockWindow[] {
  const windowType = windowTypeOfParams(panel.params);

  return windowType === null ? [] : [{ id: panel.id, windowType }];
}

export function createDockviewAdapter(api: DockviewApi): DockAdapter {
  return {
    getWindows: () => api.panels.flatMap(dockWindowsOf),
    getActiveWindowId: () => api.activePanel?.id ?? null,
    addWindow({ id, windowType }) {
      const group = api.activeGroup;
      const params = { windowType };

      api.addPanel(
        group === undefined
          ? { id, component: WINDOW_PANEL_COMPONENT, params }
          : { id, component: WINDOW_PANEL_COMPONENT, params, position: { referenceGroup: group } },
      );
    },
    activateWindow(windowId) {
      api.getPanel(windowId)?.api.setActive();
    },
    closeWindow(windowId) {
      api.getPanel(windowId)?.api.close();
    },
    subscribe(listener) {
      const subscriptions = [
        api.onDidAddPanel(listener),
        api.onDidRemovePanel(listener),
        api.onDidActivePanelChange(listener),
        api.onDidLayoutFromJSON(listener),
      ];

      return () => {
        for (const subscription of subscriptions) {
          subscription.dispose();
        }
      };
    },
  };
}
