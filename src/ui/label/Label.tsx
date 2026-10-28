import { useState } from 'react';
import type { Ref } from 'react';
import { classNames } from '@/ui/classNames';
import { TooltipBubble } from '@/ui/tooltip/TooltipBubble';
import { useTooltip } from '@/ui/tooltip/useTooltip';
import { useMergedRefs } from '@/ui/useMergedRefs';
import styles from './Label.module.css';
import { useIsTruncated } from './useIsTruncated';

export type LabelTone = 'primary' | 'secondary' | 'disabled';

interface LabelProps {
  readonly children: string;
  readonly tone?: LabelTone;
  readonly truncate?: boolean;
  readonly selectable?: boolean;
  readonly htmlFor?: string;
  readonly id?: string;
  readonly className?: string | undefined;
  readonly ref?: Ref<HTMLElement>;
}

export function Label({
  children,
  tone = 'primary',
  truncate = false,
  selectable = false,
  htmlFor,
  id,
  className,
  ref,
}: LabelProps) {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const truncated = useIsTruncated(truncate ? element : null);
  const tooltip = useTooltip({ content: children, describe: false, disabled: !truncated });
  const measuredRef = useMergedRefs<HTMLElement>(ref, setElement);
  const mergedRef = useMergedRefs<HTMLElement>(measuredRef, tooltip.setTriggerRef);
  const props = {
    ...tooltip.getTriggerProps(),
    ref: mergedRef,
    id,
    className: classNames(
      styles.root,
      styles[tone],
      truncate && styles.truncate,
      selectable && styles.selectable,
      className,
    ),
  };

  return (
    <>
      {htmlFor === undefined ? (
        <span {...props}>{children}</span>
      ) : (
        <label {...props} htmlFor={htmlFor}>
          {children}
        </label>
      )}
      {tooltip.bubble !== null && <TooltipBubble {...tooltip.bubble} />}
    </>
  );
}
