import { describe, expect, it } from 'vitest';
import indexHtml from '/index.html?raw';
import showcaseHtml from '/showcase.html?raw';
import { SYSTEM_LIGHT_THEME_QUERY } from '@/state/theme/systemTheme';
import { THEME_ATTRIBUTE } from '@/state/theme/themeApplier';
import { createSettingStorage } from '@/state/storage/settingStorage';
import type { KeyValueStorage } from '@/state/storage/settingStorage';
import { THEME_MODE_SETTING, THEME_STORAGE_KEY, resolveTheme } from '@/state/theme/themeMode';

const INLINE_SCRIPT_PATTERN = /<script>([\s\S]*?)<\/script>/g;

interface BootstrapCase {
  readonly name: string;
  readonly storedValue: string | null;
  readonly prefersLight: boolean;
  readonly storage: 'available' | 'throws-on-access' | 'throws-on-read';
}

interface BootstrapRun {
  readonly requestedKeys: readonly string[];
  readonly requestedQueries: readonly string[];
  readonly attributes: readonly (readonly [string, string])[];
}

const STORED_LIGHT_CASE: BootstrapCase = {
  name: 'stored light',
  storedValue: 'light',
  prefersLight: false,
  storage: 'available',
};

const STORED_SYSTEM_WITH_LIGHT_SYSTEM_CASE: BootstrapCase = {
  name: 'stored system with a light system',
  storedValue: 'system',
  prefersLight: true,
  storage: 'available',
};

const BOOTSTRAP_CASES: readonly BootstrapCase[] = [
  { name: 'stored dark', storedValue: 'dark', prefersLight: true, storage: 'available' },
  STORED_LIGHT_CASE,
  STORED_SYSTEM_WITH_LIGHT_SYSTEM_CASE,
  {
    name: 'stored system with a dark system',
    storedValue: 'system',
    prefersLight: false,
    storage: 'available',
  },
  { name: 'empty storage', storedValue: null, prefersLight: true, storage: 'available' },
  { name: 'garbage value', storedValue: 'Light', prefersLight: true, storage: 'available' },
  {
    name: 'storage throwing on access',
    storedValue: 'light',
    prefersLight: true,
    storage: 'throws-on-access',
  },
  {
    name: 'storage throwing on read',
    storedValue: 'light',
    prefersLight: true,
    storage: 'throws-on-read',
  },
];

function extractInlineScripts(html: string): string[] {
  return [...html.matchAll(INLINE_SCRIPT_PATTERN)].map(([, source]) => source ?? '');
}

function throwStorageError(): never {
  throw new Error('Storage is unavailable');
}

function createCaseStorage(testCase: BootstrapCase, requestedKeys: string[]): KeyValueStorage {
  return {
    getItem(key) {
      requestedKeys.push(key);
      if (testCase.storage === 'throws-on-read') {
        throwStorageError();
      }
      return key === THEME_STORAGE_KEY ? testCase.storedValue : null;
    },
    setItem: throwStorageError,
  };
}

function runBootstrapScript(source: string, testCase: BootstrapCase): BootstrapRun {
  const requestedKeys: string[] = [];
  const requestedQueries: string[] = [];
  const attributes: [string, string][] = [];
  const storage = createCaseStorage(testCase, requestedKeys);

  const fakeWindow = {
    get localStorage() {
      return testCase.storage === 'throws-on-access' ? throwStorageError() : storage;
    },
    matchMedia(query: string) {
      requestedQueries.push(query);
      return { matches: testCase.prefersLight };
    },
  };
  const fakeDocument = {
    documentElement: {
      setAttribute(name: string, value: string) {
        attributes.push([name, value]);
      },
    },
  };

  Reflect.apply(new Function('window', 'document', source), undefined, [fakeWindow, fakeDocument]);

  return { requestedKeys, requestedQueries, attributes };
}

function expectedTheme(testCase: BootstrapCase): string {
  const storage = createSettingStorage(THEME_MODE_SETTING, () =>
    testCase.storage === 'throws-on-access' ? throwStorageError() : createCaseStorage(testCase, []),
  );

  return resolveTheme(storage.load(), testCase.prefersLight);
}

const [bootstrapScript = ''] = extractInlineScripts(indexHtml);

describe('index.html theme bootstrap script', () => {
  it('is the only inline script in index.html', () => {
    expect(extractInlineScripts(indexHtml)).toHaveLength(1);
  });

  it('is repeated without changes as the only inline script in showcase.html', () => {
    expect(extractInlineScripts(showcaseHtml)).toEqual([bootstrapScript]);
  });

  it.each(BOOTSTRAP_CASES)('applies the same theme as the store for $name', (testCase) => {
    const run = runBootstrapScript(bootstrapScript, testCase);

    expect(run.attributes).toEqual([[THEME_ATTRIBUTE, expectedTheme(testCase)]]);
  });

  it('reads the mode under the theme storage key', () => {
    const run = runBootstrapScript(bootstrapScript, STORED_LIGHT_CASE);

    expect(run.requestedKeys).toEqual([THEME_STORAGE_KEY]);
  });

  it('queries the system preference with the system light theme query', () => {
    const run = runBootstrapScript(bootstrapScript, STORED_SYSTEM_WITH_LIGHT_SYSTEM_CASE);

    expect(run.requestedQueries).toEqual([SYSTEM_LIGHT_THEME_QUERY]);
  });

  it('sets the theme attribute exactly once', () => {
    for (const testCase of BOOTSTRAP_CASES) {
      const run = runBootstrapScript(bootstrapScript, testCase);

      expect(run.attributes.map(([name]) => name)).toEqual([THEME_ATTRIBUTE]);
    }
  });
});
