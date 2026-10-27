import type { Unsubscribe } from './systemTheme';
import { themeStore } from './theme';
import { createThemeApplier } from './themeApplier';
import type { FrameScheduler } from './themeApplier';

const scheduleAnimationFrame: FrameScheduler = (callback) => {
  window.requestAnimationFrame(() => {
    callback();
  });
};

export function startThemeController(): Unsubscribe {
  const applyTheme = createThemeApplier(document.documentElement, scheduleAnimationFrame);

  applyTheme(themeStore.getState().resolvedTheme);

  return themeStore.subscribe((state) => {
    applyTheme(state.resolvedTheme);
  });
}
