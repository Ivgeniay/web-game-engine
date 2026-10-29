import type { MessageRef } from '@/core/i18n/translate';

export interface UndoOperation {
  readonly label: MessageRef;
  readonly undo: () => void;
  readonly redo: () => void;
}
