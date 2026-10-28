import type { DockviewApi } from 'dockview-react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { splitLayout, tabsLayout } from '@/core/layout/layoutDescription';
import { defineWindow } from '@/core/windows/windowType';
import type { KeyValueStorage } from '@/state/storage/settingStorage';
import {
  LAYOUT_SAVE_DELAY,
  createLayoutStorage,
  restoreLayout,
  startLayoutSaving,
} from './layoutPersistence';
import type { LayoutStorage } from './layoutPersistence';
import { isStoredLayout, serializeLayout, storedLayoutOf } from './layoutSerialization';
import type { StoredLayout } from './layoutSerialization';
import { createTestDock, TEST_DOCK_WIDTH } from './testDock';

const messages = defineMessages({
  en: { window: 'Window' },
  ru: { window: 'Окно' },
});

function EmptyWindow() {
  return null;
}

function testWindow(id: string) {
  return defineWindow({ id, title: messageRef(messages, 'window'), component: EmptyWindow });
}

const hierarchyWindow = testWindow('test.hierarchy');
const sceneWindow = testWindow('test.scene');
const gameWindow = testWindow('test.game');
const removedWindow = testWindow('test.removed');

const TEST_LAYOUT_KEY = 'test-layout';

const KNOWN_WINDOW_TYPES = new Set(['test.hierarchy', 'test.scene', 'test.game']);

const defaultLayout = splitLayout('row', [
  tabsLayout([hierarchyWindow], { weight: 1 }),
  tabsLayout([sceneWindow, gameWindow], { weight: 3 }),
]);

class FakeResizeObserver {
  observe(): void {}

  unobserve(): void {}

  disconnect(): void {}
}

function createMemoryStorage(): KeyValueStorage {
  const entries = new Map<string, string>();

  return {
    getItem: (key) => entries.get(key) ?? null,
    setItem: (key, value) => {
      entries.set(key, value);
    },
  };
}

function createTestLayoutStorage(): LayoutStorage {
  const memory = createMemoryStorage();

  return createLayoutStorage(() => memory, TEST_LAYOUT_KEY);
}

function storedOf(layout: Parameters<typeof serializeLayout>[0]): StoredLayout {
  const serialized = serializeLayout(layout);

  if (serialized === null) {
    throw new Error('Layout has no windows');
  }

  return storedLayoutOf(serialized);
}

function panelIds(api: DockviewApi): string[] {
  return api.panels.map(({ id }) => id).sort();
}

function restore(api: DockviewApi, stored: StoredLayout | null) {
  return restoreLayout({
    api,
    stored,
    defaultLayout,
    isKnownWindowType: (windowType) => KNOWN_WINDOW_TYPES.has(windowType),
  });
}

async function layoutChangeDelivered(): Promise<void> {
  await Promise.resolve();
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', FakeResizeObserver);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  document.body.replaceChildren();
});

describe('restoreLayout', () => {
  it('applies the default layout with its proportions when nothing is stored', () => {
    const api = createTestDock();

    expect(restore(api, null)).toBe('default');
    expect(panelIds(api)).toEqual(['test.game', 'test.hierarchy', 'test.scene']);
    expect(api.getPanel('test.hierarchy')?.group.api.width).toBe(TEST_DOCK_WIDTH / 4);
    expect(api.getPanel('test.scene')?.group.api.width).toBe((TEST_DOCK_WIDTH * 3) / 4);
  });

  it('restores a stored layout', () => {
    const api = createTestDock();

    expect(restore(api, storedOf(tabsLayout([gameWindow])))).toBe('stored');
    expect(panelIds(api)).toEqual(['test.game']);
  });

  it('skips windows whose type is no longer registered and keeps the rest', () => {
    const api = createTestDock();
    const stored = storedOf(
      splitLayout('row', [tabsLayout([removedWindow]), tabsLayout([sceneWindow, removedWindow])]),
    );

    expect(restore(api, stored)).toBe('stored');
    expect(panelIds(api)).toEqual(['test.scene']);
    expect(api.groups).toHaveLength(1);
  });

  it('applies the default layout when every stored window is unknown', () => {
    const api = createTestDock();

    expect(restore(api, storedOf(tabsLayout([removedWindow])))).toBe('default');
    expect(panelIds(api)).toEqual(['test.game', 'test.hierarchy', 'test.scene']);
  });

  it('applies the default layout instead of a broken stored layout', () => {
    const api = createTestDock();
    const valid = storedOf(tabsLayout([sceneWindow]));
    const broken: unknown = JSON.parse(
      JSON.stringify({
        ...valid,
        current: {
          ...valid.current,
          grid: { ...valid.current.grid, root: { type: 'branch', data: 'broken' } },
        },
      }),
    );

    expect(isStoredLayout(broken)).toBe(true);
    expect(isStoredLayout(broken) && restore(api, broken)).toBe('default');
    expect(panelIds(api)).toEqual(['test.game', 'test.hierarchy', 'test.scene']);
  });

  it('leaves the dock empty without a stored and a default layout', () => {
    const api = createTestDock();
    const result = restoreLayout({
      api,
      stored: null,
      defaultLayout: null,
      isKnownWindowType: () => true,
    });

    expect(result).toBe('empty');
    expect(api.panels).toHaveLength(0);
  });
});

describe('startLayoutSaving', () => {
  function startSaving(
    api: DockviewApi,
    storage: LayoutStorage,
    pageLifecycle = new EventTarget(),
  ) {
    return startLayoutSaving({ api, storage, pageLifecycle });
  }

  it('saves the layout once after changes settle', async () => {
    vi.useFakeTimers();
    const api = createTestDock();
    const storage = createTestLayoutStorage();
    const save = vi.spyOn(storage, 'save');
    startSaving(api, storage);
    restore(api, null);
    api.getPanel('test.game')?.api.close();
    await layoutChangeDelivered();

    expect(save).not.toHaveBeenCalled();

    vi.advanceTimersByTime(LAYOUT_SAVE_DELAY);

    expect(save).toHaveBeenCalledTimes(1);
    expect(Object.keys(storage.load()?.current.panels ?? {}).sort()).toEqual([
      'test.hierarchy',
      'test.scene',
    ]);
  });

  it('saves a pending change at once when the page is hidden', async () => {
    vi.useFakeTimers();
    const api = createTestDock();
    const storage = createTestLayoutStorage();
    const pageLifecycle = new EventTarget();
    startSaving(api, storage, pageLifecycle);
    restore(api, null);
    await layoutChangeDelivered();
    pageLifecycle.dispatchEvent(new Event('pagehide'));

    expect(storage.load()).not.toBeNull();
  });

  it('saves a pending change when saving stops', async () => {
    vi.useFakeTimers();
    const api = createTestDock();
    const storage = createTestLayoutStorage();
    const stop = startSaving(api, storage);
    restore(api, null);
    await layoutChangeDelivered();
    stop();

    expect(storage.load()).not.toBeNull();
  });

  it('round-trips the layout through the browser storage key', async () => {
    vi.useFakeTimers();
    const memory = createMemoryStorage();
    const storage = createLayoutStorage(() => memory, TEST_LAYOUT_KEY);
    const first = createTestDock();
    const stop = startSaving(first, storage);
    restore(first, null);
    first.getPanel('test.game')?.api.close();
    await layoutChangeDelivered();
    stop();
    const second = createTestDock();

    expect(memory.getItem(TEST_LAYOUT_KEY)).not.toBeNull();
    expect(restore(second, storage.load())).toBe('stored');
    expect(panelIds(second)).toEqual(['test.hierarchy', 'test.scene']);
  });
});
