import { describe, expect, it } from 'vitest';
import { THEME_ATTRIBUTE, THEME_SWITCHING_ATTRIBUTE, createThemeApplier } from './themeApplier';
import type { FrameScheduler, ThemeRootElement } from './themeApplier';
import type { ResolvedTheme } from './themeMode';

interface FakeRootElement extends ThemeRootElement {
  readonly attributeWrites: number;
  hasAttribute(name: string): boolean;
}

interface ManualFrames {
  readonly schedule: FrameScheduler;
  readonly pendingCount: number;
  runFrame(): void;
}

function createFakeRootElement(initialTheme?: ResolvedTheme): FakeRootElement {
  const attributes = new Map<string, string>();
  let attributeWrites = 0;

  if (initialTheme !== undefined) {
    attributes.set(THEME_ATTRIBUTE, initialTheme);
  }

  return {
    get attributeWrites() {
      return attributeWrites;
    },
    hasAttribute: (name) => attributes.has(name),
    getAttribute: (name) => attributes.get(name) ?? null,
    setAttribute(name, value) {
      attributeWrites += 1;
      attributes.set(name, value);
    },
    removeAttribute(name) {
      attributeWrites += 1;
      attributes.delete(name);
    },
  };
}

function createManualFrames(): ManualFrames {
  let queue: (() => void)[] = [];

  return {
    schedule(callback) {
      queue.push(callback);
    },
    get pendingCount() {
      return queue.length;
    },
    runFrame() {
      const callbacks = queue;
      queue = [];
      for (const callback of callbacks) {
        callback();
      }
    },
  };
}

function setup(initialTheme?: ResolvedTheme) {
  const root = createFakeRootElement(initialTheme);
  const frames = createManualFrames();
  const applyTheme = createThemeApplier(root, frames.schedule);

  return { root, frames, applyTheme };
}

describe('createThemeApplier', () => {
  it('sets the new theme immediately and marks the switch', () => {
    const { root, applyTheme } = setup('dark');

    applyTheme('light');

    expect(root.getAttribute(THEME_ATTRIBUTE)).toBe('light');
    expect(root.hasAttribute(THEME_SWITCHING_ATTRIBUTE)).toBe(true);
  });

  it('removes the switch mark only after the second frame', () => {
    const { root, frames, applyTheme } = setup('dark');

    applyTheme('light');
    frames.runFrame();

    expect(root.hasAttribute(THEME_SWITCHING_ATTRIBUTE)).toBe(true);

    frames.runFrame();

    expect(root.hasAttribute(THEME_SWITCHING_ATTRIBUTE)).toBe(false);
    expect(root.getAttribute(THEME_ATTRIBUTE)).toBe('light');
    expect(frames.pendingCount).toBe(0);
  });

  it('does not touch attributes or schedule frames for the current theme', () => {
    const { root, frames, applyTheme } = setup('dark');

    applyTheme('dark');

    expect(root.attributeWrites).toBe(0);
    expect(frames.pendingCount).toBe(0);
  });

  it('keeps the switch mark until two frames after the last of two quick switches', () => {
    const { root, frames, applyTheme } = setup();

    applyTheme('light');
    frames.runFrame();
    applyTheme('dark');
    frames.runFrame();

    expect(root.hasAttribute(THEME_SWITCHING_ATTRIBUTE)).toBe(true);

    frames.runFrame();

    expect(root.hasAttribute(THEME_SWITCHING_ATTRIBUTE)).toBe(false);
    expect(root.getAttribute(THEME_ATTRIBUTE)).toBe('dark');
    expect(frames.pendingCount).toBe(0);
  });

  it('completes two switches made within the same frame', () => {
    const { root, frames, applyTheme } = setup();

    applyTheme('light');
    applyTheme('dark');
    frames.runFrame();

    expect(root.hasAttribute(THEME_SWITCHING_ATTRIBUTE)).toBe(true);

    frames.runFrame();

    expect(root.hasAttribute(THEME_SWITCHING_ATTRIBUTE)).toBe(false);
    expect(root.getAttribute(THEME_ATTRIBUTE)).toBe('dark');
  });

  it('completes a switch back to the initial theme made before the first one finished', () => {
    const { root, frames, applyTheme } = setup('dark');

    applyTheme('light');
    frames.runFrame();
    applyTheme('dark');
    frames.runFrame();

    expect(root.hasAttribute(THEME_SWITCHING_ATTRIBUTE)).toBe(true);

    frames.runFrame();

    expect(root.hasAttribute(THEME_SWITCHING_ATTRIBUTE)).toBe(false);
    expect(root.getAttribute(THEME_ATTRIBUTE)).toBe('dark');
    expect(frames.pendingCount).toBe(0);
  });
});
