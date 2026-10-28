import { useRef, useState } from 'react';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import { cancelTextEdit, editText, finishTextEdit } from './textEditSession';
import type { TextEditOutcome, TextEditSession } from './textEditSession';

export interface TextEditOptions {
  readonly value: string;
  readonly mixed: boolean;
  readonly live: boolean;
  readonly onValueChange: ValueChangeHandler<string> | undefined;
  readonly validate: ((text: string) => string | undefined) | undefined;
}

export interface TextEdit {
  readonly text: string;
  readonly editing: boolean;
  readonly invalidMessage: string | undefined;
  readonly change: (draft: string) => void;
  readonly commit: () => void;
  readonly cancel: () => void;
}

export function useTextEdit({
  value,
  mixed,
  live,
  onValueChange,
  validate,
}: TextEditOptions): TextEdit {
  const [session, setSession] = useState<TextEditSession | null>(null);
  const sessionRef = useRef<TextEditSession | null>(null);

  function replaceSession(next: TextEditSession | null): void {
    sessionRef.current = next;
    setSession(next);
  }

  function isValid(text: string): boolean {
    return validate?.(text) === undefined;
  }

  function report(outcome: TextEditOutcome): void {
    if (outcome !== null) {
      onValueChange?.(outcome.value, outcome.phase);
    }
  }

  function change(draft: string): void {
    const step = editText(sessionRef.current, { value, mixed }, draft, live && isValid(draft));
    replaceSession(step.session);

    if (step.preview !== undefined) {
      onValueChange?.(step.preview, 'preview');
    }
  }

  function commit(): void {
    const current = sessionRef.current;
    replaceSession(null);
    report(finishTextEdit(current, current === null || isValid(current.draft)));
  }

  function cancel(): void {
    const current = sessionRef.current;
    replaceSession(null);
    report(cancelTextEdit(current));
  }

  return {
    text: session?.draft ?? value,
    editing: session !== null,
    invalidMessage: session === null ? undefined : validate?.(session.draft),
    change,
    commit,
    cancel,
  };
}
