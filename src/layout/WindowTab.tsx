import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { MouseEvent } from 'react';
import type { IDockviewPanelHeaderProps } from 'dockview-react';
import { useTranslate } from '@/state/language/useTranslate';
import { useEditorRegistries } from '@/state/registries/registriesContext';
import { Icon } from '@/ui/icon/Icon';
import { Menu } from '@/ui/menu/Menu';
import type { MenuPoint } from '@/ui/menu/menuItems';
import { useWindowTabMenuItems } from './useWindowTabMenuItems';
import { windowTypeOfParams } from './windowPanelParams';
import styles from './WindowTab.module.css';

const DOCKVIEW_TAB_SELECTOR = '.dv-tab';
const CONTEXT_MENU_KEY = 'ContextMenu';
const SHIFT_F10_KEY = 'F10';

function isContextMenuKey(event: KeyboardEvent): boolean {
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return false;
  }

  return event.key === CONTEXT_MENU_KEY || (event.shiftKey && event.key === SHIFT_F10_KEY);
}

export function WindowTab({ api, params }: IDockviewPanelHeaderProps) {
  const { windows, workspace } = useEditorRegistries();
  const translate = useTranslate();
  const rootRef = useRef<HTMLDivElement>(null);
  const [menuPoint, setMenuPoint] = useState<MenuPoint | null>(null);
  const windowTypeId = windowTypeOfParams(params) ?? api.id;
  const windowType = useSyncExternalStore(windows.subscribe, () => windows.get(windowTypeId));
  const title = windowType === undefined ? windowTypeId : translate(windowType.title);
  const menuItems = useWindowTabMenuItems(
    menuPoint === null ? null : { windowId: api.id, windowType: windowTypeId },
  );

  useEffect(() => {
    const tab = rootRef.current?.closest(DOCKVIEW_TAB_SELECTOR) ?? null;

    if (tab === null) {
      return undefined;
    }

    const tabElement = tab;

    function openFromKeyboard(event: Event): void {
      if (!(event instanceof KeyboardEvent) || !isContextMenuKey(event)) {
        return;
      }

      event.preventDefault();
      const { left, bottom } = tabElement.getBoundingClientRect();
      setMenuPoint({ x: left, y: bottom });
    }

    tabElement.addEventListener('keydown', openFromKeyboard);

    return () => {
      tabElement.removeEventListener('keydown', openFromKeyboard);
    };
  }, []);

  function focusWindow(): void {
    workspace.requestFocus(api.id);
  }

  function openFromPointer(event: MouseEvent<HTMLDivElement>): void {
    event.preventDefault();
    setMenuPoint({ x: event.clientX, y: event.clientY });
  }

  function closeMenu(): void {
    setMenuPoint(null);
  }

  return (
    <div
      ref={rootRef}
      className={styles.root}
      onClick={focusWindow}
      onContextMenu={openFromPointer}
    >
      {windowType?.icon === undefined ? null : <Icon icon={windowType.icon} size="sm" />}
      <span className={styles.title}>{title}</span>
      <Menu label={title} items={menuItems} point={menuPoint} onClose={closeMenu} />
    </div>
  );
}
