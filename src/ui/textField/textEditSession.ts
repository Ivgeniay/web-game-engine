export interface TextEditSession<T> {
  readonly initial: T;
  readonly draft: string;
  readonly previewed: boolean;
  readonly mixed: boolean;
}

export interface TextEditStart<T> {
  readonly value: T;
  readonly mixed: boolean;
}

export type TextReading<T> =
  | { readonly valid: true; readonly value: T }
  | { readonly valid: false; readonly message: string; readonly fallback: T | undefined };

export type TextEditOutcome<T> =
  | { readonly phase: 'commit'; readonly value: T }
  | { readonly phase: 'cancel'; readonly value: T }
  | null;

export function editText<T>(
  session: TextEditSession<T> | null,
  start: TextEditStart<T>,
  draft: string,
  previewed: boolean,
): TextEditSession<T> {
  const current = session ?? { initial: start.value, previewed: false, mixed: start.mixed };

  return { ...current, draft, previewed: current.previewed || previewed };
}

export function cancelTextEdit<T>(session: TextEditSession<T> | null): TextEditOutcome<T> {
  return session?.previewed === true ? { phase: 'cancel', value: session.initial } : null;
}

export function committedValue<T>(reading: TextReading<T>): T | undefined {
  return reading.valid ? reading.value : reading.fallback;
}

export function finishTextEdit<T>(
  session: TextEditSession<T> | null,
  reading: TextReading<T>,
): TextEditOutcome<T> {
  if (session === null) {
    return null;
  }

  const value = committedValue(reading);

  if (value === undefined) {
    return cancelTextEdit(session);
  }

  const changed = !Object.is(value, session.initial) || session.previewed || session.mixed;

  return changed ? { phase: 'commit', value } : null;
}
