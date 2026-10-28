import type { DockviewApi, IDockviewPanel } from 'dockview-react';
import type { DockAdapter, DockWindow } from '@/core/windows/workspace';
import { applyLayout } from './layoutPersistence';
import { WINDOW_PANEL_COMPONENT, windowPanelParams, windowTypeOfParams } from './windowPanelParams';

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
      const params = windowPanelParams(windowType);

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
    applyLayout(layout) {
      applyLayout(api, layout);
    },
    maximizeWindow(windowId) {
      const panel = api.getPanel(windowId);

      if (panel !== undefined) {
        api.maximizeGroup(panel);
      }
    },
    restoreMaximized() {
      api.exitMaximizedGroup();
    },
    isMaximized: () => api.hasMaximizedGroup(),
    subscribe(listener) {
      const subscriptions = [
        api.onDidAddPanel(listener),
        api.onDidRemovePanel(listener),
        api.onDidActivePanelChange(listener),
        api.onDidLayoutFromJSON(listener),
        api.onDidMaximizedGroupChange(listener),
      ];

      return () => {
        for (const subscription of subscriptions) {
          subscription.dispose();
        }
      };
    },
  };
}
