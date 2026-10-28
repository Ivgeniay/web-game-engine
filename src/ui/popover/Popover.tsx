import {
  autoUpdate,
  FloatingFocusManager,
  FloatingNode,
  FloatingTree,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import type { ReferenceType } from '@floating-ui/react';
import { useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import { classNames } from '@/ui/classNames';
import { usePopupMiddleware } from '@/ui/popup/popupPosition';
import { PopupPortal } from '@/ui/popup/PopupPortal';
import popupSurface from '@/ui/popup/popupSurface.module.css';
import { useCloseWhenAnchorHides } from '@/ui/popup/useCloseWhenAnchorHides';
import styles from './Popover.module.css';

export interface PopoverTriggerProps extends Record<string, unknown> {
  readonly ref: (node: ReferenceType | null) => void;
}

interface PopoverProps {
  readonly label: string;
  readonly trigger: (triggerProps: PopoverTriggerProps) => ReactNode;
  readonly children: ReactNode;
  readonly open?: boolean | undefined;
  readonly onOpenChange?: ((open: boolean) => void) | undefined;
  readonly className?: string | undefined;
}

const FIRST_TABBABLE = 0;

function PopoverRoot({ label, trigger, children, open, onOpenChange, className }: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open ?? internalOpen;
  const nodeId = useFloatingNodeId();
  const middleware = usePopupMiddleware({ fitHeight: true });

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (open === undefined) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [open, onOpenChange],
  );

  const { refs, floatingStyles, context, middlewareData } = useFloating({
    nodeId,
    open: isOpen,
    onOpenChange: handleOpenChange,
    placement: 'bottom-start',
    middleware,
    whileElementsMounted: autoUpdate,
  });

  useCloseWhenAnchorHides(isOpen, middlewareData.hide?.referenceHidden, handleOpenChange);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useRole(context, { role: 'dialog' }),
    useDismiss(context),
  ]);

  const setReference = useCallback(
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

  return (
    <FloatingNode id={nodeId}>
      {trigger({ ...getReferenceProps(), ref: setReference })}
      {isOpen && (
        <PopupPortal>
          <FloatingFocusManager
            context={context}
            modal={false}
            initialFocus={FIRST_TABBABLE}
            returnFocus
          >
            <div
              {...getFloatingProps()}
              ref={setFloating}
              className={classNames(popupSurface.surface, styles.root, className)}
              style={floatingStyles}
              aria-label={label}
            >
              {children}
            </div>
          </FloatingFocusManager>
        </PopupPortal>
      )}
    </FloatingNode>
  );
}

export function Popover(props: PopoverProps) {
  const parentId = useFloatingParentNodeId();

  if (parentId !== null) {
    return <PopoverRoot {...props} />;
  }

  return (
    <FloatingTree>
      <PopoverRoot {...props} />
    </FloatingTree>
  );
}
