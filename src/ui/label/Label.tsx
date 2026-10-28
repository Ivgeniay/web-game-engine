import { useState } from 'react';
import type { Ref } from 'react';
import { classNames } from '@/ui/classNames';
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
  const mergedRef = useMergedRefs(ref, setElement);
  const truncated = useIsTruncated(truncate ? element : null);
  const props = {
    ref: mergedRef,
    id,
    className: classNames(
      styles.root,
      styles[tone],
      truncate && styles.truncate,
      selectable && styles.selectable,
      className,
    ),
    title: truncated ? children : undefined,
  };

  if (htmlFor !== undefined) {
    return (
      <label {...props} htmlFor={htmlFor}>
        {children}
      </label>
    );
  }

  return <span {...props}>{children}</span>;
}
