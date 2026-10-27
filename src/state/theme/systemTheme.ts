export const SYSTEM_LIGHT_THEME_QUERY = '(prefers-color-scheme: light)';

const MEDIA_CHANGE_EVENT = 'change';

export interface MediaQueryChange {
  readonly matches: boolean;
}

export type MediaQueryChangeListener = (change: MediaQueryChange) => void;

export interface MediaQuery {
  readonly matches: boolean;
  addEventListener(type: typeof MEDIA_CHANGE_EVENT, listener: MediaQueryChangeListener): void;
  removeEventListener(type: typeof MEDIA_CHANGE_EVENT, listener: MediaQueryChangeListener): void;
}

export type MediaQueryProvider = (query: string) => MediaQuery;

export type SystemThemeListener = (prefersLight: boolean) => void;

export type Unsubscribe = () => void;

export interface SystemTheme {
  prefersLight(): boolean;
  subscribe(listener: SystemThemeListener): Unsubscribe;
}

export function createSystemTheme(matchMedia: MediaQueryProvider): SystemTheme {
  const query = matchMedia(SYSTEM_LIGHT_THEME_QUERY);

  return {
    prefersLight() {
      return query.matches;
    },

    subscribe(listener) {
      const handleChange: MediaQueryChangeListener = (change) => {
        listener(change.matches);
      };

      query.addEventListener(MEDIA_CHANGE_EVENT, handleChange);

      return () => {
        query.removeEventListener(MEDIA_CHANGE_EVENT, handleChange);
      };
    },
  };
}
