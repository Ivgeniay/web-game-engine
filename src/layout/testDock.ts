import { createDockview } from 'dockview-react';
import type { DockviewApi } from 'dockview-react';

export const TEST_DOCK_WIDTH = 1000;
export const TEST_DOCK_HEIGHT = 600;

export function createTestDock(): DockviewApi {
  const element = document.createElement('div');
  document.body.append(element);
  const api = createDockview(element, {
    createComponent: () => ({ element: document.createElement('div'), init: () => undefined }),
  });
  api.layout(TEST_DOCK_WIDTH, TEST_DOCK_HEIGHT);

  return api;
}
