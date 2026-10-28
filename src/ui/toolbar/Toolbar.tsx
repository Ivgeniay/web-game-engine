import type { ReactNode } from 'react';
import { classNames } from '@/ui/classNames';
import { RovingFocusContext } from '@/ui/rovingFocus/rovingFocusContext';
import { useRovingFocusGroup } from '@/ui/rovingFocus/useRovingFocusGroup';
import styles from './Toolbar.module.css';

interface ToolbarProps {
  readonly label: string;
  readonly children: ReactNode;
  readonly className?: string | undefined;
}

export function Toolbar({ label, children, className }: ToolbarProps) {
  const { registry, onKeyDown } = useRovingFocusGroup({ orientation: 'horizontal' });

  return (
    <RovingFocusContext value={registry}>
      <div
        className={classNames(styles.root, className)}
        role="toolbar"
        aria-label={label}
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
      >
        {children}
      </div>
    </RovingFocusContext>
  );
}
