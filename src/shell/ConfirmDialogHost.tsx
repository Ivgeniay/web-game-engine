import { useRef } from 'react';
import { useStore } from 'zustand';
import { commonMessages } from '@/core/i18n/commonMessages';
import type { ConfirmRequest } from '@/state/dialogs/confirmDialogStore';
import { useMessages } from '@/state/language/useMessages';
import { useTranslate } from '@/state/language/useTranslate';
import { useEditorRegistries } from '@/state/registries/registriesContext';
import { Button } from '@/ui/button/Button';
import { Dialog } from '@/ui/dialog/Dialog';

export function ConfirmDialogHost() {
  const { dialogs } = useEditorRegistries();
  const request = useStore(dialogs.store, (state) => state.queue[0] ?? null);

  if (request === null) {
    return null;
  }

  return <ConfirmDialogWindow key={request.id} request={request} />;
}

interface ConfirmDialogWindowProps {
  readonly request: ConfirmRequest;
}

function ConfirmDialogWindow({ request }: ConfirmDialogWindowProps) {
  const { dialogs } = useEditorRegistries();
  const translate = useTranslate();
  const common = useMessages(commonMessages);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { id, options } = request;
  const { answer } = dialogs.store.getState();

  return (
    <Dialog
      open
      title={translate(options.title)}
      description={options.message === undefined ? undefined : translate(options.message)}
      initialFocus={options.destructive === true ? cancelRef : confirmRef}
      onClose={() => {
        answer(id, 'cancel');
      }}
      onSubmit={() => {
        answer(id, 'confirm');
      }}
      actions={
        <>
          <Button
            ref={cancelRef}
            onClick={() => {
              answer(id, 'cancel');
            }}
          >
            {options.cancelLabel === undefined ? common('cancel') : translate(options.cancelLabel)}
          </Button>
          <Button ref={confirmRef} type="submit" variant="accent">
            {translate(options.confirmLabel)}
          </Button>
        </>
      }
    />
  );
}
