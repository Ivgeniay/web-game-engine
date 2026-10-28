import { isTextInput } from '@/core/textInput';
import type { Unsubscribe } from '@/core/unsubscribe';

function suppressNativeContextMenu(event: Event): void {
  if (event.target instanceof Element && isTextInput(event.target)) {
    return;
  }

  event.preventDefault();
}

export function startNativeContextMenuSuppression(target: EventTarget): Unsubscribe {
  target.addEventListener('contextmenu', suppressNativeContextMenu);

  return () => {
    target.removeEventListener('contextmenu', suppressNativeContextMenu);
  };
}
