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
