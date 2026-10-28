import type { DockviewApi } from 'dockview-react';
import type { LayoutNode } from '@/core/layout/layoutDescription';
import type { Unsubscribe } from '@/core/unsubscribe';
import { createJsonSettingStorage } from '@/state/storage/settingStorage';
import type { SettingStorage, StorageProvider } from '@/state/storage/settingStorage';
import {
  dockedPartOf,
  layoutSetting,
  serializeLayout,
  storedLayoutOf,
} from './layoutSerialization';
import type { StoredLayout } from './layoutSerialization';
import { windowTypeOfParams } from './windowPanelParams';

export const LAYOUT_SAVE_DELAY = 500;

const PAGE_HIDE_EVENT = 'pagehide';

export type LayoutStorage = SettingStorage<StoredLayout | null>;

export type LayoutRestoreResult = 'stored' | 'default' | 'empty';

export interface LayoutRestoreOptions {
  readonly api: DockviewApi;
  readonly stored: StoredLayout | null;
  readonly defaultLayout: LayoutNode | null;
  readonly isKnownWindowType: (windowType: string) => boolean;
}

export interface LayoutSavingOptions {
  readonly api: DockviewApi;
  readonly storage: LayoutStorage;
  readonly pageLifecycle: EventTarget;
}

export function createLayoutStorage(getStorage: StorageProvider, key: string): LayoutStorage {
  return createJsonSettingStorage(layoutSetting(key), getStorage);
}

export function applyLayout(api: DockviewApi, layout: LayoutNode | null): void {
  api.clear();
  const serialized = layout === null ? null : serializeLayout(layout);

  if (serialized !== null) {
    api.fromJSON(serialized);
  }
}

function closeUnknownWindows(api: DockviewApi, isKnownWindowType: (id: string) => boolean): void {
  for (const panel of [...api.panels]) {
    const windowType = windowTypeOfParams(panel.params);

    if (windowType === null || !isKnownWindowType(windowType)) {
      api.removePanel(panel);
    }
  }
}

function restoreStored(
  api: DockviewApi,
  stored: StoredLayout,
  isKnownWindowType: (id: string) => boolean,
): boolean {
  try {
    api.fromJSON(dockedPartOf(stored.current));
    closeUnknownWindows(api, isKnownWindowType);
  } catch {
    return false;
  }

  return api.panels.length > 0 || Object.keys(stored.current.panels).length === 0;
}

export function restoreLayout({
  api,
  stored,
  defaultLayout,
  isKnownWindowType,
}: LayoutRestoreOptions): LayoutRestoreResult {
  if (stored !== null && restoreStored(api, stored, isKnownWindowType)) {
    return 'stored';
  }

  applyLayout(api, defaultLayout);

  return api.panels.length > 0 ? 'default' : 'empty';
}

export function startLayoutSaving({
  api,
  storage,
  pageLifecycle,
}: LayoutSavingOptions): Unsubscribe {
  let timer: ReturnType<typeof setTimeout> | null = null;

  function save(): void {
    storage.save(storedLayoutOf(dockedPartOf(api.toJSON())));
  }

  function flush(): void {
    if (timer === null) {
      return;
    }

    clearTimeout(timer);
    timer = null;
    save();
  }

  function scheduleSave(): void {
    if (timer !== null) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      timer = null;
      save();
    }, LAYOUT_SAVE_DELAY);
  }

  const subscription = api.onDidLayoutChange(scheduleSave);
  pageLifecycle.addEventListener(PAGE_HIDE_EVENT, flush);

  return () => {
    subscription.dispose();
    pageLifecycle.removeEventListener(PAGE_HIDE_EVENT, flush);
    flush();
  };
}
