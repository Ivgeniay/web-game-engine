import { NextFloatingDelayGroup } from '@floating-ui/react';
import type { ReactNode } from 'react';
import { TOOLTIP_DELAY, TOOLTIP_GROUP_TIMEOUT_MS } from '@/ui/tooltip/tooltipTiming';

interface PopupLayerProps {
  readonly children: ReactNode;
}

export function PopupLayer({ children }: PopupLayerProps) {
  return (
    <NextFloatingDelayGroup delay={TOOLTIP_DELAY} timeoutMs={TOOLTIP_GROUP_TIMEOUT_MS}>
      {children}
    </NextFloatingDelayGroup>
  );
}
