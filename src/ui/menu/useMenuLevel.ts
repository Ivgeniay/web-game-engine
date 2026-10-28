import {
  autoUpdate,
  safePolygon,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingTree,
  useHover,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead,
} from '@floating-ui/react';
import type { FloatingRootContext, ReferenceType, VirtualElement } from '@floating-ui/react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import type { CSSProperties, HTMLProps, RefObject } from 'react';
import { usePopupMiddleware } from '@/ui/popup/popupPosition';
import { useCloseWhenAnchorHides } from '@/ui/popup/useCloseWhenAnchorHides';
import type { MenuLevelContextValue } from './menuLevelContext';

export const SUBMENU_OPEN_DELAY_MS = 75;

const SELECT_EVENT = 'menu-select';

export interface MenuLevelOptions {
  readonly nested: boolean;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly elementsRef: RefObject<(HTMLElement | null)[]>;
  readonly labelsRef: RefObject<(string | null)[]>;
  readonly virtualReference?: VirtualElement | null | undefined;
}

export interface MenuListRefs {
  readonly elementsRef: RefObject<(HTMLElement | null)[]>;
  readonly labelsRef: RefObject<(string | null)[]>;
}

export interface MenuLevel {
  readonly nodeId: string | undefined;
  readonly nested: boolean;
  readonly open: boolean;
  readonly context: FloatingRootContext;
  readonly floatingStyles: CSSProperties;
  readonly levelContext: MenuLevelContextValue;
  readonly setReference: (node: ReferenceType | null) => void;
  readonly setFloating: (node: HTMLElement | null) => void;
  readonly getReferenceProps: (userProps?: HTMLProps<Element>) => Record<string, unknown>;
  readonly getFloatingProps: (userProps?: HTMLProps<HTMLElement>) => Record<string, unknown>;
}

export function useMenuLevel({
  nested,
  open,
  onOpenChange,
  elementsRef,
  labelsRef,
  virtualReference,
}: MenuLevelOptions): MenuLevel {
  const tree = useFloatingTree();
  const nodeId = useFloatingNodeId();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const middleware = usePopupMiddleware({ fitHeight: true });

  const { refs, floatingStyles, context, middlewareData } = useFloating({
    nodeId,
    open,
    onOpenChange,
    placement: nested ? 'right-start' : 'bottom-start',
    middleware,
    whileElementsMounted: autoUpdate,
  });

  useLayoutEffect(() => {
    if (virtualReference !== undefined) {
      refs.setPositionReference(virtualReference);
    }
  }, [refs, virtualReference]);

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    useHover(context, {
      enabled: nested,
      delay: { open: SUBMENU_OPEN_DELAY_MS },
      handleClose: safePolygon({ blockPointerEvents: true }),
    }),
    useClick(context, { event: 'mousedown', toggle: !nested, ignoreMouse: nested }),
    useRole(context, { role: 'menu' }),
    useDismiss(context),
    useListNavigation(context, {
      listRef: elementsRef,
      activeIndex,
      nested,
      loop: true,
      focusItemOnOpen: nested ? 'auto' : true,
      onNavigate: setActiveIndex,
    }),
    useTypeahead(context, {
      listRef: labelsRef,
      activeIndex,
      onMatch: open ? setActiveIndex : undefined,
    }),
  ]);

  useCloseWhenAnchorHides(open, middlewareData.hide?.referenceHidden, onOpenChange);

  useEffect(() => {
    function closeOnSelect() {
      onOpenChange(false);
    }

    tree?.events.on(SELECT_EVENT, closeOnSelect);

    return () => {
      tree?.events.off(SELECT_EVENT, closeOnSelect);
    };
  }, [tree, onOpenChange]);

  const selectAndClose = useCallback(() => {
    tree?.events.emit(SELECT_EVENT);
  }, [tree]);

  const levelContext = useMemo<MenuLevelContextValue>(
    () => ({ activeIndex, getItemProps, selectAndClose }),
    [activeIndex, getItemProps, selectAndClose],
  );

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

  return {
    nodeId,
    nested,
    open,
    context,
    floatingStyles,
    levelContext,
    setReference,
    setFloating,
    getReferenceProps,
    getFloatingProps,
  };
}
