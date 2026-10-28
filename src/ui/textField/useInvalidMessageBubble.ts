import { autoUpdate, useFloating } from '@floating-ui/react';
import { useCallback, useId } from 'react';
import { usePopupMiddleware } from '@/ui/popup/popupPosition';
import type { TooltipBubbleProps } from '@/ui/tooltip/useTooltip';

export interface InvalidMessageBubble {
  readonly setAnchorRef: (node: HTMLElement | null) => void;
  readonly describedBy: string | undefined;
  readonly bubble: TooltipBubbleProps | null;
}

export function useInvalidMessageBubble(message: string | undefined): InvalidMessageBubble {
  const id = useId();
  const open = message !== undefined;
  const middleware = usePopupMiddleware({ fitHeight: false });
  const { refs, floatingStyles, middlewareData } = useFloating({
    open,
    placement: 'bottom-start',
    middleware,
    whileElementsMounted: autoUpdate,
  });

  const setAnchorRef = useCallback(
    (node: HTMLElement | null) => {
      refs.setReference(node);
    },
    [refs],
  );
  const setFloating = useCallback(
    (node: HTMLElement | null) => {
      refs.setFloating(node);
    },
    [refs],
  );

  return {
    setAnchorRef,
    describedBy: open ? id : undefined,
    bubble: open
      ? {
          content: message,
          shortcut: undefined,
          setFloating,
          floatingStyles,
          floatingProps: { id },
          referenceHidden: middlewareData.hide?.referenceHidden === true,
        }
      : null,
  };
}
