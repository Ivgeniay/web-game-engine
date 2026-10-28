import { useCallback, useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { isTextInput } from '@/core/textInput';
import type { ContextMenuContext } from '@/core/menus/contextMenuRegistry';
import { buildMenuTree } from '@/core/menus/menuTree';
import { useEditorRegistries } from '@/state/registries/registriesContext';
import type { MenuPoint } from '@/ui/menu/menuItems';
import type { ContextMenuRequest } from './ContextMenu';
import { hasVisibleItems } from './menuItemsFromTree';

export interface ContextMenuTriggerProps {
  readonly onContextMenu: (event: MouseEvent<HTMLElement>) => void;
  readonly onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

export interface ContextMenuState<TTarget> {
  readonly request: ContextMenuRequest<TTarget> | null;
  readonly close: () => void;
  readonly getTriggerProps: (target: TTarget) => ContextMenuTriggerProps;
}

const SECONDARY_MOUSE_BUTTON = 2;
const CONTEXT_MENU_KEY = 'ContextMenu';
const SHIFT_F10_KEY = 'F10';

function ignoresEvent(event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>): boolean {
  const { target, currentTarget, defaultPrevented } = event;

  return (
    defaultPrevented ||
    !(target instanceof Element) ||
    !currentTarget.contains(target) ||
    isTextInput(target)
  );
}

function isContextMenuKey(event: KeyboardEvent<HTMLElement>): boolean {
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return false;
  }

  return event.key === CONTEXT_MENU_KEY || (event.shiftKey && event.key === SHIFT_F10_KEY);
}

function pointBelow(element: EventTarget, fallback: HTMLElement): MenuPoint {
  const anchor = element instanceof Element ? element : fallback;
  const { left, bottom } = anchor.getBoundingClientRect();

  return { x: left, y: bottom };
}

export function useContextMenu<TTarget>(
  context: ContextMenuContext<TTarget>,
): ContextMenuState<TTarget> {
  const { contextMenus, commands } = useEditorRegistries();
  const [request, setRequest] = useState<ContextMenuRequest<TTarget> | null>(null);

  const close = useCallback(() => {
    setRequest(null);
  }, []);

  const getTriggerProps = useCallback(
    (target: TTarget): ContextMenuTriggerProps => {
      function open(point: MenuPoint): void {
        const tree = buildMenuTree(contextMenus.getEntries(context));

        if (hasVisibleItems(tree, commands)) {
          setRequest({ point, target });
        }
      }

      return {
        onContextMenu(event) {
          if (ignoresEvent(event)) {
            return;
          }

          event.preventDefault();
          open(
            event.button === SECONDARY_MOUSE_BUTTON
              ? { x: event.clientX, y: event.clientY }
              : pointBelow(event.target, event.currentTarget),
          );
        },
        onKeyDown(event) {
          if (!isContextMenuKey(event) || ignoresEvent(event)) {
            return;
          }

          event.preventDefault();
          open(pointBelow(event.target, event.currentTarget));
        },
      };
    },
    [contextMenus, commands, context],
  );

  return { request, close, getTriggerProps };
}
