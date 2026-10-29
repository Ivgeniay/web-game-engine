import type { ComponentPropsWithRef, KeyboardEvent, ReactNode } from 'react';
import { classNames } from '@/ui/classNames';
import { useRovingFocusItem } from '@/ui/rovingFocus/useRovingFocusItem';
import { FoldoutChevron } from './FoldoutChevron';
import { FoldoutContext } from './foldoutContext';
import { useFoldout } from './useFoldout';
import styles from './Foldout.module.css';
import headerStyles from './foldoutHeader.module.css';

type NativeButtonProps = Omit<
  ComponentPropsWithRef<'button'>,
  'style' | 'type' | 'children' | 'onClick' | 'aria-expanded' | 'aria-controls' | 'className'
>;

interface FoldoutProps extends NativeButtonProps {
  readonly label: string;
  readonly expanded: boolean;
  readonly onExpandedChange: (expanded: boolean) => void;
  readonly children: ReactNode;
  readonly className?: string | undefined;
}

export function Foldout({
  label,
  expanded,
  onExpandedChange,
  children,
  className,
  ref,
  tabIndex,
  onFocus,
  onKeyDown,
  disabled,
  ...buttonProps
}: FoldoutProps) {
  const foldout = useFoldout({ expanded, onExpandedChange });
  const roving = useRovingFocusItem<HTMLButtonElement>({
    ref,
    tabIndex,
    onFocus,
    disabled: disabled ?? false,
    preferred: false,
  });

  return (
    <div className={classNames(styles.root, className)}>
      <button
        {...buttonProps}
        {...roving}
        type="button"
        className={headerStyles.header}
        disabled={disabled}
        aria-expanded={expanded}
        aria-controls={foldout.contentId}
        onClick={foldout.toggle}
        onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
          onKeyDown?.(event);

          if (!event.defaultPrevented) {
            foldout.handleKeyDown(event);
          }
        }}
      >
        <FoldoutChevron expanded={expanded} />
        <span className={headerStyles.label}>{label}</span>
      </button>
      <FoldoutContext value={foldout.broadcast}>
        <div id={foldout.contentId} className={styles.content} hidden={!expanded}>
          {children}
        </div>
      </FoldoutContext>
    </div>
  );
}
