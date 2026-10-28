import type { IDockviewPanel } from 'dockview-react';
import type { WindowTabTarget } from '@/core/windows/windowType';

export const WINDOW_PANEL_COMPONENT = 'editor-window';

export type WindowPanelParams = {
  readonly windowType: string;
};

export function windowPanelParams(windowType: string): WindowPanelParams {
  return { windowType };
}

export function windowTypeOfParams(params: unknown): string | null {
  if (typeof params !== 'object' || params === null || !('windowType' in params)) {
    return null;
  }

  const { windowType } = params;

  return typeof windowType === 'string' ? windowType : null;
}

export function windowTabTargetOf(panel: IDockviewPanel): WindowTabTarget {
  return { windowId: panel.id, windowType: windowTypeOfParams(panel.params) ?? panel.id };
}
