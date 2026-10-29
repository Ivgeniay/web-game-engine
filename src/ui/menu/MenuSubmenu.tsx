import { FloatingNode, useListItem } from '@floating-ui/react';
import { useId, useRef, useState } from 'react';
import { useMergedRefs } from '@/ui/useMergedRefs';
import styles from './Menu.module.css';
import type { MenuSubmenuItem } from '@/contracts/menu';
import { MenuList } from './MenuList';
import { MenuRowContent } from './MenuRowContent';
import { useMenuLevel } from './useMenuLevel';
import { useMenuLevelContext } from './useMenuLevelContext';

interface MenuSubmenuProps {
  readonly item: MenuSubmenuItem;
}

const ACTIVE_TAB_INDEX = 0;
const INACTIVE_TAB_INDEX = -1;

export function MenuSubmenu({ item }: MenuSubmenuProps) {
  const parent = useMenuLevelContext();
  const [open, setOpen] = useState(false);
  const elementsRef = useRef<(HTMLElement | null)[]>([]);
  const labelsRef = useRef<(string | null)[]>([]);
  const level = useMenuLevel({
    nested: true,
    open,
    onOpenChange: setOpen,
    elementsRef,
    labelsRef,
  });
  const disabled = item.disabled === true;
  const { ref: listItemRef, index: listItemIndex } = useListItem({
    label: disabled ? null : item.label,
  });
  const ref = useMergedRefs<HTMLButtonElement>(level.setReference, listItemRef);
  const active = listItemIndex === parent.activeIndex;
  const shortcutId = useId();

  return (
    <FloatingNode id={level.nodeId}>
      <button
        ref={ref}
        type="button"
        role="menuitem"
        className={styles.item}
        tabIndex={active ? ACTIVE_TAB_INDEX : INACTIVE_TAB_INDEX}
        disabled={disabled}
        data-active={active ? '' : undefined}
        data-open={open ? '' : undefined}
        {...level.getReferenceProps(parent.getItemProps())}
      >
        <MenuRowContent
          label={item.label}
          mark={item.icon}
          shortcut={undefined}
          shortcutId={shortcutId}
          active={active || open}
          hasSubmenu
        />
      </button>
      <MenuList level={level} elementsRef={elementsRef} labelsRef={labelsRef} items={item.items} />
    </FloatingNode>
  );
}
