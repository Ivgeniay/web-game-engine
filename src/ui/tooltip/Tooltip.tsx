import type { ReferenceType } from '@floating-ui/react';
import type { ReactNode } from 'react';
import { TooltipBubble } from './TooltipBubble';
import { useTooltip } from './useTooltip';
import type { TooltipOptions } from './useTooltip';

export interface TooltipTriggerProps extends Record<string, unknown> {
  readonly ref: (node: ReferenceType | null) => void;
}

interface TooltipProps extends TooltipOptions {
  readonly children: (triggerProps: TooltipTriggerProps) => ReactNode;
}

export function Tooltip({ children, ...options }: TooltipProps) {
  const tooltip = useTooltip(options);

  return (
    <>
      {children({ ...tooltip.getTriggerProps(), ref: tooltip.setTriggerRef })}
      {tooltip.bubble !== null && <TooltipBubble {...tooltip.bubble} />}
    </>
  );
}
