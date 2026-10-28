import { describe, expect, it } from 'vitest';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { createConfirmDialogStore } from './confirmDialogStore';
import type { ConfirmOptions } from './confirmDialogStore';

const messages = defineMessages({
  en: { deleteTitle: 'Delete the object?', delete: 'Delete', closeTitle: 'Close the scene?' },
  ru: { deleteTitle: 'Удалить объект?', delete: 'Удалить', closeTitle: 'Закрыть сцену?' },
});

const DELETE: ConfirmOptions = {
  title: messageRef(messages, 'deleteTitle'),
  confirmLabel: messageRef(messages, 'delete'),
  destructive: true,
};
const CLOSE: ConfirmOptions = {
  title: messageRef(messages, 'closeTitle'),
  confirmLabel: messageRef(messages, 'delete'),
};

describe('createConfirmDialogStore', () => {
  it('puts a request into the queue and resolves it with the answer', async () => {
    const store = createConfirmDialogStore();

    const answer = store.getState().confirm(DELETE);
    const [request] = store.getState().queue;

    expect(request?.options).toBe(DELETE);

    store.getState().answer(request?.id ?? -1, 'confirm');

    await expect(answer).resolves.toBe('confirm');
    expect(store.getState().queue).toEqual([]);
  });

  it('keeps the second request waiting until the first one is answered', async () => {
    const store = createConfirmDialogStore();
    const first = store.getState().confirm(DELETE);
    const second = store.getState().confirm(CLOSE);

    expect(store.getState().queue.map((request) => request.options)).toEqual([DELETE, CLOSE]);

    store.getState().answer(store.getState().queue[0]?.id ?? -1, 'cancel');

    expect(store.getState().queue.map((request) => request.options)).toEqual([CLOSE]);

    store.getState().answer(store.getState().queue[0]?.id ?? -1, 'confirm');

    await expect(first).resolves.toBe('cancel');
    await expect(second).resolves.toBe('confirm');
  });

  it('ignores a repeated answer', async () => {
    const store = createConfirmDialogStore();
    const answer = store.getState().confirm(DELETE);
    const id = store.getState().queue[0]?.id ?? -1;
    void store.getState().confirm(CLOSE);

    store.getState().answer(id, 'cancel');
    store.getState().answer(id, 'confirm');

    await expect(answer).resolves.toBe('cancel');
    expect(store.getState().queue).toHaveLength(1);
  });
});
