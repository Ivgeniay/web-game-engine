import { describe, expect, it } from 'vitest';
import { SYSTEM_LIGHT_THEME_QUERY, createSystemTheme } from './systemTheme';
import type { MediaQuery, MediaQueryChangeListener } from './systemTheme';

interface FakeMediaQuery extends MediaQuery {
  readonly listenerCount: number;
  change(matches: boolean): void;
}

function createFakeMediaQuery(initialMatches: boolean): FakeMediaQuery {
  let matches = initialMatches;
  const listeners = new Set<MediaQueryChangeListener>();

  return {
    get matches() {
      return matches;
    },
    get listenerCount() {
      return listeners.size;
    },
    addEventListener(_type, listener) {
      listeners.add(listener);
    },
    removeEventListener(_type, listener) {
      listeners.delete(listener);
    },
    change(nextMatches) {
      matches = nextMatches;
      for (const listener of listeners) {
        listener({ matches: nextMatches });
      }
    },
  };
}

function createRecorder() {
  const received: boolean[] = [];

  return {
    received,
    listener: (prefersLight: boolean) => {
      received.push(prefersLight);
    },
  };
}

describe('createSystemTheme', () => {
  it('queries the system light theme preference', () => {
    const requestedQueries: string[] = [];

    createSystemTheme((query) => {
      requestedQueries.push(query);
      return createFakeMediaQuery(false);
    });

    expect(requestedQueries).toEqual([SYSTEM_LIGHT_THEME_QUERY]);
  });

  it.each([true, false])(
    'reports the current preference when the query matches is %s',
    (matches) => {
      const mediaQuery = createFakeMediaQuery(matches);
      const systemTheme = createSystemTheme(() => mediaQuery);

      expect(systemTheme.prefersLight()).toBe(matches);

      mediaQuery.change(!matches);

      expect(systemTheme.prefersLight()).toBe(!matches);
    },
  );

  it('notifies a subscriber when the system preference changes', () => {
    const mediaQuery = createFakeMediaQuery(false);
    const recorder = createRecorder();

    createSystemTheme(() => mediaQuery).subscribe(recorder.listener);
    mediaQuery.change(true);
    mediaQuery.change(false);

    expect(recorder.received).toEqual([true, false]);
  });

  it('stops notifying and removes the handler after unsubscribing', () => {
    const mediaQuery = createFakeMediaQuery(false);
    const recorder = createRecorder();

    const unsubscribe = createSystemTheme(() => mediaQuery).subscribe(recorder.listener);
    unsubscribe();
    mediaQuery.change(true);

    expect(recorder.received).toEqual([]);
    expect(mediaQuery.listenerCount).toBe(0);
  });

  it('keeps other subscribers when one of them unsubscribes', () => {
    const mediaQuery = createFakeMediaQuery(false);
    const systemTheme = createSystemTheme(() => mediaQuery);
    const first = createRecorder();
    const second = createRecorder();

    const unsubscribeFirst = systemTheme.subscribe(first.listener);
    const unsubscribeSecond = systemTheme.subscribe(second.listener);
    mediaQuery.change(true);
    unsubscribeFirst();
    mediaQuery.change(false);

    expect(first.received).toEqual([true]);
    expect(second.received).toEqual([true, false]);
    expect(mediaQuery.listenerCount).toBe(1);

    unsubscribeSecond();

    expect(mediaQuery.listenerCount).toBe(0);
  });
});
