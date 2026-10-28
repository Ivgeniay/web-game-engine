export interface TextEditSession {
  readonly initial: string;
  readonly draft: string;
  readonly previewed: boolean;
  readonly mixed: boolean;
}

export interface TextEditStart {
  readonly value: string;
  readonly mixed: boolean;
}

export interface TextEditStep {
  readonly session: TextEditSession;
  readonly preview: string | undefined;
}

export type TextEditOutcome =
  | { readonly phase: 'commit'; readonly value: string }
  | { readonly phase: 'cancel'; readonly value: string }
  | null;

export function editText(
  session: TextEditSession | null,
  start: TextEditStart,
  draft: string,
  previewDraft: boolean,
): TextEditStep {
  const current = session ?? {
    initial: start.value,
    draft: start.value,
    previewed: false,
    mixed: start.mixed,
  };

  return {
    session: { ...current, draft, previewed: current.previewed || previewDraft },
    preview: previewDraft ? draft : undefined,
  };
}

export function cancelTextEdit(session: TextEditSession | null): TextEditOutcome {
  return session?.previewed === true ? { phase: 'cancel', value: session.initial } : null;
}

export function finishTextEdit(session: TextEditSession | null, valid: boolean): TextEditOutcome {
  if (session === null) {
    return null;
  }

  if (!valid) {
    return cancelTextEdit(session);
  }

  const changed = session.draft !== session.initial || session.previewed || session.mixed;

  return changed ? { phase: 'commit', value: session.draft } : null;
}
