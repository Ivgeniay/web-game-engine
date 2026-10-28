import {
  FloatingFocusManager,
  FloatingNode,
  FloatingOverlay,
  FloatingTree,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { useCallback, useId } from 'react';
import type { KeyboardEvent, ReactNode, RefObject } from 'react';
import { classNames } from '@/ui/classNames';
import { PopupPortal } from '@/ui/popup/PopupPortal';
import popupSurface from '@/ui/popup/popupSurface.module.css';
import styles from './Dialog.module.css';
import { keepsEnterForItself } from './dialogKeys';

interface DialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly description?: string | undefined;
  readonly children?: ReactNode;
  readonly actions: ReactNode;
  readonly onSubmit?: (() => void) | undefined;
  readonly initialFocus?: RefObject<HTMLElement | null> | undefined;
  readonly className?: string | undefined;
}

const FIRST_TABBABLE = 0;

function submitOnEnter(event: KeyboardEvent<HTMLFormElement>): void {
  const { key, target, currentTarget, defaultPrevented, nativeEvent } = event;

  if (
    key !== 'Enter' ||
    defaultPrevented ||
    nativeEvent.isComposing ||
    !(target instanceof Node) ||
    !currentTarget.contains(target) ||
    keepsEnterForItself(target)
  ) {
    return;
  }

  event.preventDefault();
  currentTarget.requestSubmit();
}

function DialogWindow({
  open,
  onClose,
  title,
  description,
  children,
  actions,
  onSubmit,
  initialFocus,
  className,
}: DialogProps) {
  const nodeId = useFloatingNodeId();
  const titleId = useId();
  const descriptionId = useId();

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        onClose();
      }
    },
    [onClose],
  );

  const { refs, context } = useFloating({ nodeId, open, onOpenChange: handleOpenChange });
  const { getFloatingProps } = useInteractions([
    useDismiss(context, { outsidePress: false }),
    useRole(context, { role: 'dialog' }),
  ]);

  const setFloating = useCallback(
    (node: HTMLElement | null) => {
      refs.setFloating(node);
    },
    [refs],
  );

  return (
    <FloatingNode id={nodeId}>
      {open && (
        <PopupPortal>
          <FloatingOverlay className={styles.backdrop} lockScroll>
            <FloatingFocusManager
              context={context}
              initialFocus={initialFocus ?? FIRST_TABBABLE}
              returnFocus
            >
              <form
                {...getFloatingProps({
                  onKeyDown: onSubmit === undefined ? undefined : submitOnEnter,
                })}
                ref={setFloating}
                className={classNames(popupSurface.surface, styles.window)}
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={description === undefined ? undefined : descriptionId}
                noValidate
                onSubmit={(event) => {
                  event.preventDefault();
                  onSubmit?.();
                }}
              >
                <h2 id={titleId} className={styles.title}>
                  {title}
                </h2>
                {description !== undefined && (
                  <p id={descriptionId} className={styles.description}>
                    {description}
                  </p>
                )}
                {children !== undefined && (
                  <div className={classNames(styles.body, className)}>{children}</div>
                )}
                <div className={styles.actions}>{actions}</div>
              </form>
            </FloatingFocusManager>
          </FloatingOverlay>
        </PopupPortal>
      )}
    </FloatingNode>
  );
}

export function Dialog(props: DialogProps) {
  const parentId = useFloatingParentNodeId();

  if (parentId !== null) {
    return <DialogWindow {...props} />;
  }

  return (
    <FloatingTree>
      <DialogWindow {...props} />
    </FloatingTree>
  );
}
