import { useRef } from 'react';
import type { KeyboardEvent } from 'react';
import type { ValueChangeHandler } from '@/contracts/valueChange';

interface SessionState<T> {
  readonly start: T;
  readonly value: T;
  readonly key: string | undefined;
}

export interface PreviewSession<T> {
  readonly base: () => T;
  readonly preview: (next: T, key: string | undefined) => void;
  readonly finish: (commit: boolean) => void;
  readonly cancelHeldKey: (event: KeyboardEvent<HTMLElement>) => boolean;
  readonly releaseKey: (event: KeyboardEvent<HTMLElement>) => void;
  readonly releaseFocus: () => void;
}

const ESCAPE_KEY = 'Escape';

export function usePreviewSession<T>(
  value: T,
  onValueChange: ValueChangeHandler<T> | undefined,
): PreviewSession<T> {
  const sessionRef = useRef<SessionState<T> | null>(null);

  function finish(commit: boolean): void {
    const session = sessionRef.current;
    sessionRef.current = null;

    if (session !== null) {
      onValueChange?.(commit ? session.value : session.start, commit ? 'commit' : 'cancel');
    }
  }

  function isKeySession(): boolean {
    return sessionRef.current !== null && sessionRef.current.key !== undefined;
  }

  return {
    base: () => (sessionRef.current === null ? value : sessionRef.current.value),
    preview: (next, key) => {
      const session = sessionRef.current ?? { start: value, value, key };
      sessionRef.current = { ...session, value: next, key };
      onValueChange?.(next, 'preview');
    },
    finish,
    cancelHeldKey: (event) => {
      if (event.key !== ESCAPE_KEY || !isKeySession()) {
        return false;
      }

      event.preventDefault();
      event.stopPropagation();
      finish(false);

      return true;
    },
    releaseKey: (event) => {
      if (sessionRef.current?.key === event.key) {
        finish(true);
      }
    },
    releaseFocus: () => {
      if (isKeySession()) {
        finish(true);
      }
    },
  };
}
