import type { Unsubscribe } from '@/core/unsubscribe';
import { createThemeApplier } from './themeApplier';
import type { FrameScheduler } from './themeApplier';
import type { ThemeStore } from './themeStore';

const scheduleAnimationFrame: FrameScheduler = (callback) => {
  window.requestAnimationFrame(() => {
    callback();
  });
};

export function startThemeController(themeStore: ThemeStore): Unsubscribe {
  const applyTheme = createThemeApplier(document.documentElement, scheduleAnimationFrame);

  applyTheme(themeStore.getState().resolvedTheme);

  return themeStore.subscribe((state) => {
    applyTheme(state.resolvedTheme);
  });
}
