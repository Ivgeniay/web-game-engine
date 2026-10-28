import { useRef, useState } from 'react';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import { cancelTextEdit, editText, finishTextEdit } from './textEditSession';
import type { TextEditOutcome, TextEditSession, TextReading } from './textEditSession';

export interface TextEditOptions<T> {
  readonly value: T;
  readonly mixed: boolean;
  readonly live: boolean;
  readonly onValueChange: ValueChangeHandler<T> | undefined;
  readonly format: (value: T) => string;
  readonly read: (text: string) => TextReading<T>;
}

export interface TextEdit {
  readonly text: string;
  readonly editing: boolean;
  readonly invalidMessage: string | undefined;
  readonly change: (draft: string) => void;
  readonly replace: (draft: string) => void;
  readonly commit: () => boolean;
  readonly cancel: () => boolean;
}

export function useTextEdit<T>({
  value,
  mixed,
  live,
  onValueChange,
  format,
  read,
}: TextEditOptions<T>): TextEdit {
  const [session, setSession] = useState<TextEditSession<T> | null>(null);
  const sessionRef = useRef<TextEditSession<T> | null>(null);
  const reading = session === null ? null : read(session.draft);

  function replaceSession(next: TextEditSession<T> | null): void {
    sessionRef.current = next;
    setSession(next);
  }

  function report(outcome: TextEditOutcome<T>): void {
    if (outcome !== null) {
      onValueChange?.(outcome.value, outcome.phase);
    }
  }

  function edit(draft: string, preview: boolean): void {
    const draftReading = read(draft);
    const previewed = preview && draftReading.valid;
    replaceSession(editText(sessionRef.current, { value, mixed }, draft, previewed));

    if (previewed) {
      onValueChange?.(draftReading.value, 'preview');
    }
  }

  function commit(): boolean {
    const current = sessionRef.current;
    replaceSession(null);

    if (current === null) {
      return false;
    }

    report(finishTextEdit(current, read(current.draft)));

    return true;
  }

  function cancel(): boolean {
    const current = sessionRef.current;
    replaceSession(null);
    report(cancelTextEdit(current));

    return current !== null;
  }

  return {
    text: session?.draft ?? format(value),
    editing: session !== null,
    invalidMessage: reading?.valid === false ? reading.message : undefined,
    change: (draft) => {
      edit(draft, live);
    },
    replace: (draft) => {
      edit(draft, true);
    },
    commit,
    cancel,
  };
}
