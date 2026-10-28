export interface TooltipDelay {
  readonly open: number;
  readonly close: number;
}

export const TOOLTIP_DELAY: TooltipDelay = { open: 500, close: 0 };

export const TOOLTIP_GROUP_TIMEOUT_MS = 300;
