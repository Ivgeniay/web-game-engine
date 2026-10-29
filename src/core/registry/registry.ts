import { reportDevelopmentError } from '@/shared/developmentError';
import type { Unsubscribe } from '@/core/unsubscribe';

export interface Registry<T> {
  readonly register: (entry: T) => Unsubscribe;
  readonly get: (id: string) => T | undefined;
  readonly getSnapshot: () => readonly T[];
  readonly subscribe: (listener: () => void) => Unsubscribe;
}

export interface RegistryOptions<T> {
  readonly kind: string;
  readonly getId: (entry: T) => string;
}

function ignoreUnsubscribe(): void {}

export function createRegistry<T>({ kind, getId }: RegistryOptions<T>): Registry<T> {
  const entries = new Map<string, T>();
  const listeners = new Set<() => void>();
  let snapshot: readonly T[] = [];

  function changed(): void {
    snapshot = [...entries.values()];

    for (const listener of [...listeners]) {
      listener();
    }
  }

  return {
    register(entry) {
      const id = getId(entry);

      if (entries.has(id)) {
        reportDevelopmentError(`Duplicate ${kind} id "${id}".`);
        return ignoreUnsubscribe;
      }

      entries.set(id, entry);
      changed();

      return () => {
        if (entries.get(id) !== entry) {
          return;
        }

        entries.delete(id);
        changed();
      };
    },
    get: (id) => entries.get(id),
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };
}
