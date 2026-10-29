import { FloatingNode, FloatingTree, useFloatingParentNodeId } from '@floating-ui/react';
import type { ReferenceType, VirtualElement } from '@floating-ui/react';
import { useCallback, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode, RefObject } from 'react';
import type { MenuItem, MenuNavigationDirection, MenuPoint } from './menuItems';
import { MenuList } from './MenuList';
import { useMenuLevel } from './useMenuLevel';

export interface MenuTriggerProps extends Record<string, unknown> {
  readonly ref: (node: ReferenceType | null) => void;
}

interface MenuBaseProps {
  readonly items: readonly MenuItem[];
  readonly onNavigateOut?: ((direction: MenuNavigationDirection) => void) | undefined;
}

interface TriggerMenuProps extends MenuBaseProps {
  readonly trigger: (triggerProps: MenuTriggerProps) => ReactNode;
  readonly label?: never;
  readonly open?: boolean | undefined;
  readonly onOpenChange?: ((open: boolean) => void) | undefined;
  readonly returnFocusRef?: RefObject<HTMLElement | null> | undefined;
  readonly point?: never;
  readonly onClose?: never;
}

interface PointMenuProps extends MenuBaseProps {
  readonly label: string;
  readonly point: MenuPoint | null;
  readonly onClose: () => void;
  readonly trigger?: never;
  readonly open?: never;
  readonly onOpenChange?: never;
  readonly returnFocusRef?: never;
}

type MenuProps = TriggerMenuProps | PointMenuProps;

function pointElement(point: MenuPoint): VirtualElement {
  return {
    getBoundingClientRect: () => ({
      x: point.x,
      y: point.y,
      top: point.y,
      left: point.x,
      right: point.x,
      bottom: point.y,
      width: 0,
      height: 0,
    }),
  };
}

function navigationDirection(event: KeyboardEvent<HTMLElement>): MenuNavigationDirection | null {
  const { target, currentTarget, key } = event;

  if (!(target instanceof Element) || !currentTarget.contains(target)) {
    return null;
  }
  if (key === 'ArrowLeft') {
    return 'previous';
  }
  if (key === 'ArrowRight') {
    return 'next';
  }

  return null;
}

function TriggerMenu({
  items,
  onNavigateOut,
  trigger,
  open,
  onOpenChange,
  returnFocusRef,
}: TriggerMenuProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open ?? internalOpen;

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (open === undefined) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [open, onOpenChange],
  );

  const elementsRef = useRef<(HTMLElement | null)[]>([]);
  const labelsRef = useRef<(string | null)[]>([]);
  const level = useMenuLevel({
    nested: false,
    open: isOpen,
    onOpenChange: handleOpenChange,
    elementsRef,
    labelsRef,
  });

  return (
    <FloatingNode id={level.nodeId}>
      {trigger({ ...level.getReferenceProps(), ref: level.setReference })}
      <MenuList
        level={level}
        elementsRef={elementsRef}
        labelsRef={labelsRef}
        items={items}
        returnFocusRef={returnFocusRef}
        onKeyDown={navigateOutHandler(onNavigateOut)}
      />
    </FloatingNode>
  );
}

function PointMenu({ label, items, onNavigateOut, point, onClose }: PointMenuProps) {
  const virtualReference = useMemo(() => (point === null ? null : pointElement(point)), [point]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        onClose();
      }
    },
    [onClose],
  );

  const elementsRef = useRef<(HTMLElement | null)[]>([]);
  const labelsRef = useRef<(string | null)[]>([]);
  const level = useMenuLevel({
    nested: false,
    open: point !== null,
    onOpenChange: handleOpenChange,
    elementsRef,
    labelsRef,
    virtualReference,
  });

  return (
    <FloatingNode id={level.nodeId}>
      <MenuList
        level={level}
        elementsRef={elementsRef}
        labelsRef={labelsRef}
        label={label}
        items={items}
        onKeyDown={navigateOutHandler(onNavigateOut)}
      />
    </FloatingNode>
  );
}

function navigateOutHandler(
  onNavigateOut: ((direction: MenuNavigationDirection) => void) | undefined,
): ((event: KeyboardEvent<HTMLElement>) => void) | undefined {
  if (onNavigateOut === undefined) {
    return undefined;
  }

  return (event) => {
    const direction = navigationDirection(event);

    if (direction !== null) {
      onNavigateOut(direction);
    }
  };
}

function MenuRoot(props: MenuProps) {
  return props.point === undefined ? <TriggerMenu {...props} /> : <PointMenu {...props} />;
}

export function Menu(props: MenuProps) {
  const parentId = useFloatingParentNodeId();

  if (parentId !== null) {
    return <MenuRoot {...props} />;
  }

  return (
    <FloatingTree>
      <MenuRoot {...props} />
    </FloatingTree>
  );
}
