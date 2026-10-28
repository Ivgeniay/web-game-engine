import { createStore } from 'zustand/vanilla';
import type { StoreApi } from 'zustand/vanilla';
import type { MessageRef } from '@/core/i18n/translate';

export const CONFIRM_ANSWERS = ['confirm', 'cancel'] as const;

export type ConfirmAnswer = (typeof CONFIRM_ANSWERS)[number];

export interface ConfirmOptions {
  readonly title: MessageRef;
  readonly message?: MessageRef | undefined;
  readonly confirmLabel: MessageRef;
  readonly cancelLabel?: MessageRef | undefined;
  readonly destructive?: boolean | undefined;
}

export interface ConfirmRequest {
  readonly id: number;
  readonly options: ConfirmOptions;
}

export interface ConfirmDialogState {
  readonly queue: readonly ConfirmRequest[];
  readonly confirm: (options: ConfirmOptions) => Promise<ConfirmAnswer>;
  readonly answer: (id: number, answer: ConfirmAnswer) => void;
}

export type ConfirmDialogStore = StoreApi<ConfirmDialogState>;

export function createConfirmDialogStore(): ConfirmDialogStore {
  const resolvers = new Map<number, (answer: ConfirmAnswer) => void>();
  let nextId = 0;

  return createStore<ConfirmDialogState>()((set) => ({
    queue: [],
    confirm(options) {
      const id = nextId;
      nextId += 1;

      return new Promise<ConfirmAnswer>((resolve) => {
        resolvers.set(id, resolve);
        set((state) => ({ queue: [...state.queue, { id, options }] }));
      });
    },
    answer(id, answer) {
      const resolve = resolvers.get(id);

      if (resolve === undefined) {
        return;
      }

      resolvers.delete(id);
      set((state) => ({ queue: state.queue.filter((request) => request.id !== id) }));
      resolve(answer);
    },
  }));
}

export interface ConfirmDialogs {
  readonly confirm: (options: ConfirmOptions) => Promise<ConfirmAnswer>;
  readonly store: ConfirmDialogStore;
}

export function createConfirmDialogs(): ConfirmDialogs {
  const store = createConfirmDialogStore();

  return { confirm: (options) => store.getState().confirm(options), store };
}
