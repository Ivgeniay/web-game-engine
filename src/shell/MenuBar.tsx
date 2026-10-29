import { useCallback, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import type { ComponentPropsWithRef, KeyboardEvent } from 'react';
import { commonMessages } from '@/core/i18n/commonMessages';
import { buildMenuTree } from '@/core/menus/menuTree';
import type { MenuNodeGroup, MenuSubmenuNode } from '@/core/menus/menuTree';
import { useMessages } from '@/state/language/useMessages';
import { useTranslate } from '@/state/language/useTranslate';
import { usePlatform } from '@/state/platform/platformContext';
import { useFormatShortcut } from '@/state/platform/useFormatShortcut';
import { useEditorRegistries } from '@/state/registries/registriesContext';
import { classNames } from '@/ui/classNames';
import { Menu } from '@/ui/menu/Menu';
import type { MenuItem } from '@/contracts/menu';
import type { MenuNavigationDirection } from '@/ui/menu/menuItems';
import { RovingFocusContext } from '@/ui/rovingFocus/rovingFocusContext';
import { useRovingFocusGroup } from '@/ui/rovingFocus/useRovingFocusGroup';
import { useRovingFocusItem } from '@/ui/rovingFocus/useRovingFocusItem';
import styles from './MenuBar.module.css';
import { hasVisibleItems, menuItemsFromTree } from './menuItemsFromTree';
import { useMenuBarActivation } from './useMenuBarActivation';

interface MenuBarProps {
  readonly altKeyActivates?: boolean;
  readonly className?: string | undefined;
}

const NO_ITEMS: readonly MenuItem[] = [];
const ESCAPE_KEY = 'Escape';
const DIRECTION_STEPS: Readonly<Record<MenuNavigationDirection, number>> = {
  previous: -1,
  next: 1,
};

function topMenus(groups: readonly MenuNodeGroup<undefined>[]): MenuSubmenuNode<undefined>[] {
  return groups.flat().filter((node) => node.kind === 'submenu');
}

function wrapIndex(index: number, length: number): number {
  return (index + length) % length;
}

export function MenuBar({ altKeyActivates = true, className }: MenuBarProps) {
  const { mainMenu, commands } = useEditorRegistries();
  const entries = useSyncExternalStore(mainMenu.subscribe, mainMenu.getEntries);
  useSyncExternalStore(commands.subscribe, commands.getVersion);
  const common = useMessages(commonMessages);
  const translate = useTranslate();
  const formatShortcut = useFormatShortcut();
  const platform = usePlatform();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef(new Map<string, HTMLElement>());
  const { registry, onKeyDown: onRovingKeyDown } = useRovingFocusGroup({
    orientation: 'horizontal',
  });
  const { leaveMenuBar } = useMenuBarActivation({
    barRef,
    altKeyActivates: altKeyActivates && platform !== 'mac',
  });

  const tree = useMemo(() => buildMenuTree(entries), [entries]);
  const menus = topMenus(tree).filter((menu) => hasVisibleItems(menu.groups, commands));

  const closeMenu = useCallback((path: string) => {
    setOpenPath((current) => (current === path ? null : current));
  }, []);

  function navigateOut(index: number, direction: MenuNavigationDirection): void {
    const neighbor = menus[wrapIndex(index + DIRECTION_STEPS[direction], menus.length)];

    if (neighbor === undefined) {
      return;
    }

    triggersRef.current.get(neighbor.path)?.focus();
    setOpenPath(neighbor.path);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    const insideBar = event.target instanceof Node && event.currentTarget.contains(event.target);

    if (insideBar && event.key === ESCAPE_KEY && openPath === null) {
      event.preventDefault();
      leaveMenuBar();
      return;
    }

    onRovingKeyDown?.(event);
  }

  function itemsOf(menu: MenuSubmenuNode<undefined>): readonly MenuItem[] {
    if (menu.path !== openPath) {
      return NO_ITEMS;
    }

    return menuItemsFromTree(menu.groups, {
      commands,
      source: 'menu',
      target: undefined,
      translate,
      formatShortcut,
    });
  }

  return (
    <RovingFocusContext value={registry}>
      <div
        ref={barRef}
        role="menubar"
        aria-label={common('menu')}
        className={classNames(styles.root, className)}
        onKeyDown={handleKeyDown}
      >
        {menus.map((menu, index) => (
          <Menu
            key={menu.path}
            items={itemsOf(menu)}
            open={menu.path === openPath}
            onOpenChange={(open) => {
              if (open) {
                setOpenPath(menu.path);
              } else {
                closeMenu(menu.path);
              }
            }}
            onNavigateOut={(direction) => {
              navigateOut(index, direction);
            }}
            trigger={(triggerProps) => (
              <MenuBarTrigger
                {...triggerProps}
                label={translate(menu.label)}
                ref={(element: HTMLButtonElement | null) => {
                  triggerProps.ref(element);

                  if (element === null) {
                    triggersRef.current.delete(menu.path);
                  } else {
                    triggersRef.current.set(menu.path, element);
                  }
                }}
                onPointerEnter={() => {
                  if (openPath !== null && openPath !== menu.path) {
                    triggersRef.current.get(menu.path)?.focus();
                    setOpenPath(menu.path);
                  }
                }}
              />
            )}
          />
        ))}
      </div>
    </RovingFocusContext>
  );
}

interface MenuBarTriggerProps extends Omit<
  ComponentPropsWithRef<'button'>,
  'children' | 'style' | 'type'
> {
  readonly label: string;
}

function MenuBarTrigger({ label, ref, tabIndex, onFocus, ...buttonProps }: MenuBarTriggerProps) {
  const rovingProps = useRovingFocusItem({
    ref,
    tabIndex,
    onFocus,
    disabled: false,
    preferred: false,
  });

  return (
    <button
      {...buttonProps}
      {...rovingProps}
      type="button"
      role="menuitem"
      className={styles.trigger}
    >
      {label}
    </button>
  );
}
