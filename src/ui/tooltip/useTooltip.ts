import {
  autoUpdate,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useNextDelayGroup,
  useRole,
} from '@floating-ui/react';
import type { ReferenceType } from '@floating-ui/react';
import { useCallback, useState } from 'react';
import type { CSSProperties, HTMLProps } from 'react';
import { isTooltipBlocked } from '@/ui/popup/popupLayerAttributes';
import { usePopupMiddleware } from '@/ui/popup/popupPosition';
import { TOOLTIP_DELAY } from './tooltipTiming';
import type { TooltipDelay } from './tooltipTiming';

export interface TooltipOptions {
  readonly content: string;
  readonly shortcut?: string | undefined;
  readonly describe?: boolean | undefined;
  readonly disabled?: boolean | undefined;
}

export interface TooltipBubbleProps {
  readonly content: string;
  readonly shortcut: string | undefined;
  readonly setFloating: (node: HTMLElement | null) => void;
  readonly floatingStyles: CSSProperties;
  readonly floatingProps: Record<string, unknown>;
  readonly referenceHidden: boolean;
}

export interface TooltipController {
  readonly setTriggerRef: (node: ReferenceType | null) => void;
  readonly getTriggerProps: (userProps?: HTMLProps<Element>) => Record<string, unknown>;
  readonly bubble: TooltipBubbleProps | null;
}

export function useTooltip({
  content,
  shortcut,
  describe = true,
  disabled = false,
}: TooltipOptions): TooltipController {
  const [open, setOpen] = useState(false);
  const visible = open && !disabled;
  const middleware = usePopupMiddleware({ fitHeight: false });

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen && !isTooltipBlocked(document));
  }, []);

  const { refs, floatingStyles, context, middlewareData } = useFloating({
    open: visible,
    onOpenChange: handleOpenChange,
    placement: 'bottom',
    middleware,
    whileElementsMounted: autoUpdate,
  });

  const { delayRef, hasProvider } = useNextDelayGroup(context, { enabled: !disabled });
  const delay = useCallback(
    (): TooltipDelay => (hasProvider ? toTooltipDelay(delayRef.current) : TOOLTIP_DELAY),
    [hasProvider, delayRef],
  );

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, { enabled: !disabled, move: false, delay }),
    useFocus(context, { enabled: !disabled }),
    useDismiss(context, { enabled: !disabled, referencePress: true }),
    useRole(context, { role: 'tooltip', enabled: describe }),
  ]);

  const setTriggerRef = useCallback(
    (node: ReferenceType | null) => {
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
    setTriggerRef,
    getTriggerProps: getReferenceProps,
    bubble: visible
      ? {
          content,
          shortcut,
          setFloating,
          floatingStyles,
          floatingProps: getFloatingProps(),
          referenceHidden: middlewareData.hide?.referenceHidden === true,
        }
      : null,
  };
}

interface PartialDelay {
  readonly open?: number | undefined;
  readonly close?: number | undefined;
}

function toTooltipDelay(delay: number | PartialDelay | undefined): TooltipDelay {
  if (typeof delay === 'number') {
    return { open: delay, close: delay };
  }

  return { open: delay?.open ?? TOOLTIP_DELAY.open, close: delay?.close ?? TOOLTIP_DELAY.close };
}
