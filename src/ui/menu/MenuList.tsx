import { FloatingFocusManager, FloatingList } from '@floating-ui/react';
import type { KeyboardEvent } from 'react';
import { classNames } from '@/ui/classNames';
import { POPUP_BLOCKS_TOOLTIPS_PROPS } from '@/ui/popup/popupLayerAttributes';
import { PopupPortal } from '@/ui/popup/PopupPortal';
import popupSurface from '@/ui/popup/popupSurface.module.css';
import styles from './Menu.module.css';
import type { MenuItem } from './menuItems';
import { MenuItemView } from './MenuItemView';
import { MenuLevelContext } from './menuLevelContext';
import type { MenuLevel, MenuListRefs } from './useMenuLevel';

interface MenuListProps extends MenuListRefs {
  readonly level: MenuLevel;
  readonly label?: string | undefined;
  readonly items: readonly MenuItem[];
  readonly onKeyDown?: ((event: KeyboardEvent<HTMLElement>) => void) | undefined;
}

const FIRST_TABBABLE = 0;
const NO_INITIAL_FOCUS = -1;

export function MenuList({
  level,
  elementsRef,
  labelsRef,
  label,
  items,
  onKeyDown,
}: MenuListProps) {
  const { open, nested, context, levelContext, floatingStyles, setFloating, getFloatingProps } =
    level;

  return (
    <MenuLevelContext value={levelContext}>
      <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
        {open && (
          <PopupPortal>
            <FloatingFocusManager
              context={context}
              modal={false}
              initialFocus={nested ? NO_INITIAL_FOCUS : FIRST_TABBABLE}
              returnFocus
            >
              <div
                {...POPUP_BLOCKS_TOOLTIPS_PROPS}
                {...getFloatingProps({ onKeyDown })}
                ref={setFloating}
                className={classNames(popupSurface.surface, styles.menu)}
                style={floatingStyles}
                aria-label={label}
              >
                {items.map((item) => (
                  <MenuItemView key={item.id} item={item} />
                ))}
              </div>
            </FloatingFocusManager>
          </PopupPortal>
        )}
      </FloatingList>
    </MenuLevelContext>
  );
}
