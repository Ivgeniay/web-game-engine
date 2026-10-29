export type FoldoutListener = (expanded: boolean) => void;

export interface FoldoutBroadcast {
  readonly subscribe: (listener: FoldoutListener) => () => void;
  readonly emit: (expanded: boolean) => void;
}

export function createFoldoutBroadcast(): FoldoutBroadcast {
  const listeners = new Set<FoldoutListener>();

  return {
    subscribe(listener) {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
    emit(expanded) {
      for (const listener of [...listeners]) {
        listener(expanded);
      }
    },
  };
}
