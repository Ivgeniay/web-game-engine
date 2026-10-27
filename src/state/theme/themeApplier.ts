import type { ResolvedTheme } from './themeMode';

export const THEME_ATTRIBUTE = 'data-theme';
export const THEME_SWITCHING_ATTRIBUTE = 'data-theme-switching';

const FRAMES_BEFORE_TRANSITIONS_RESUME = 2;

export interface ThemeRootElement {
  getAttribute(name: string): string | null;
  setAttribute(name: string, value: string): void;
  removeAttribute(name: string): void;
}

export type FrameScheduler = (callback: () => void) => void;

export type ThemeApplier = (theme: ResolvedTheme) => void;

function afterFrames(
  scheduleFrame: FrameScheduler,
  frameCount: number,
  callback: () => void,
): void {
  if (frameCount === 0) {
    callback();
    return;
  }

  scheduleFrame(() => {
    afterFrames(scheduleFrame, frameCount - 1, callback);
  });
}

export function createThemeApplier(
  root: ThemeRootElement,
  scheduleFrame: FrameScheduler,
): ThemeApplier {
  let pendingSwitches = 0;

  function finishSwitch(): void {
    pendingSwitches -= 1;

    if (pendingSwitches === 0) {
      root.removeAttribute(THEME_SWITCHING_ATTRIBUTE);
    }
  }

  return (theme) => {
    if (root.getAttribute(THEME_ATTRIBUTE) === theme) {
      return;
    }

    pendingSwitches += 1;
    root.setAttribute(THEME_SWITCHING_ATTRIBUTE, '');
    root.setAttribute(THEME_ATTRIBUTE, theme);
    afterFrames(scheduleFrame, FRAMES_BEFORE_TRANSITIONS_RESUME, finishSwitch);
  };
}
