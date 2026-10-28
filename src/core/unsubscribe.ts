export type Unsubscribe = () => void;

export function combineUnsubscribes(...unsubscribes: readonly Unsubscribe[]): Unsubscribe {
  return () => {
    for (const unsubscribe of [...unsubscribes].reverse()) {
      unsubscribe();
    }
  };
}
