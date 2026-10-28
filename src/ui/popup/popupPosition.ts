import { flip, hide, offset, shift, size } from '@floating-ui/react';
import type { Middleware } from '@floating-ui/react';
import { useMemo } from 'react';

export const POPUP_GAP_TOKEN = '--space-4';
export const POPUP_VIEWPORT_PADDING_TOKEN = '--space-8';

const NO_PIXELS = 0;

export function parsePixelValue(value: string): number {
  const pixels = Number.parseFloat(value);

  return Number.isFinite(pixels) ? pixels : NO_PIXELS;
}

export function readPixelToken(name: string): number {
  return parsePixelValue(getComputedStyle(document.documentElement).getPropertyValue(name));
}

export interface PopupMiddlewareOptions {
  readonly fitHeight: boolean;
}

function viewportPadding(): number {
  return readPixelToken(POPUP_VIEWPORT_PADDING_TOKEN);
}

export function createPopupMiddleware({ fitHeight }: PopupMiddlewareOptions): Middleware[] {
  const fitHeightMiddleware = size(() => ({
    padding: viewportPadding(),
    apply({ availableHeight, elements }) {
      elements.floating.style.maxHeight = `${String(availableHeight)}px`;
    },
  }));

  return [
    offset(() => readPixelToken(POPUP_GAP_TOKEN)),
    flip(() => ({ padding: viewportPadding() })),
    shift(() => ({ padding: viewportPadding() })),
    ...(fitHeight ? [fitHeightMiddleware] : []),
    hide(),
  ];
}

export function usePopupMiddleware(options: PopupMiddlewareOptions): Middleware[] {
  const { fitHeight } = options;

  return useMemo(() => createPopupMiddleware({ fitHeight }), [fitHeight]);
}
