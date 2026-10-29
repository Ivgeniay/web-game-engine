import { useId, useState } from 'react';
import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { frameworkIcons } from '@/icons/frameworkIcons';
import type { IconSource } from '@/icons/icon';
import { Checkbox } from '@/ui/checkbox/Checkbox';
import { classNames } from '@/ui/classNames';
import { FoldoutChevron } from '@/ui/foldout/FoldoutChevron';
import { FoldoutContext } from '@/ui/foldout/foldoutContext';
import { useFoldout } from '@/ui/foldout/useFoldout';
import { Icon } from '@/ui/icon/Icon';
import { IconButton } from '@/ui/iconButton/IconButton';
import { Menu } from '@/ui/menu/Menu';
import type { MenuItem, MenuPoint } from '@/ui/menu/menuItems';
import { useRovingFocusItem } from '@/ui/rovingFocus/useRovingFocusItem';
import styles from './ComponentHeader.module.css';

interface ComponentHeaderBaseProps {
  readonly title: string;
  readonly icon?: IconSource | undefined;
  readonly expanded: boolean;
  readonly onExpandedChange: (expanded: boolean) => void;
  readonly children: ReactNode;
  readonly className?: string | undefined;
}

type EnabledToggleProps =
  | {
      readonly enabled: boolean;
      readonly onEnabledChange: (enabled: boolean) => void;
      readonly enabledLabel: string;
    }
  | { readonly enabled?: never; readonly onEnabledChange?: never; readonly enabledLabel?: never };

type HelpButtonProps =
  | { readonly onHelp: () => void; readonly helpLabel: string }
  | { readonly onHelp?: never; readonly helpLabel?: never };

type HeaderMenuProps =
  | { readonly menuItems: readonly MenuItem[]; readonly menuLabel: string }
  | { readonly menuItems?: never; readonly menuLabel?: never };

type ComponentHeaderProps = ComponentHeaderBaseProps &
  EnabledToggleProps &
  HelpButtonProps &
  HeaderMenuProps;

const SECONDARY_MOUSE_BUTTON = 2;
const CONTEXT_MENU_KEY = 'ContextMenu';
const SHIFT_F10_KEY = 'F10';
const CONTROL_SELECTOR = 'button, input, [data-header-control]';

function isContextMenuKey(event: KeyboardEvent<HTMLElement>): boolean {
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return false;
  }

  return event.key === CONTEXT_MENU_KEY || (event.shiftKey && event.key === SHIFT_F10_KEY);
}

function isOnControl(event: MouseEvent<HTMLElement>): boolean {
  return event.target instanceof Element && event.target.closest(CONTROL_SELECTOR) !== null;
}

export function ComponentHeader({
  title,
  icon,
  expanded,
  onExpandedChange,
  children,
  className,
  enabled,
  onEnabledChange,
  enabledLabel,
  onHelp,
  helpLabel,
  menuItems,
  menuLabel,
}: ComponentHeaderProps) {
  const titleId = useId();
  const foldout = useFoldout({ expanded, onExpandedChange });
  const [menuPoint, setMenuPoint] = useState<MenuPoint | null>(null);
  const toggle = useRovingFocusItem<HTMLButtonElement>({
    ref: undefined,
    tabIndex: undefined,
    onFocus: undefined,
    disabled: false,
    preferred: false,
  });

  function openMenuAt(point: MenuPoint): void {
    if (menuItems !== undefined) {
      setMenuPoint(point);
    }
  }

  function handleContextMenu(event: MouseEvent<HTMLDivElement>): void {
    if (menuItems === undefined) {
      return;
    }

    event.preventDefault();

    if (event.button === SECONDARY_MOUSE_BUTTON) {
      openMenuAt({ x: event.clientX, y: event.clientY });
    } else {
      const { left, bottom } = event.currentTarget.getBoundingClientRect();
      openMenuAt({ x: left, y: bottom });
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (menuItems === undefined || !isContextMenuKey(event)) {
      return;
    }

    event.preventDefault();

    const { left, bottom } = event.currentTarget.getBoundingClientRect();
    openMenuAt({ x: left, y: bottom });
  }

  return (
    <div className={classNames(styles.root, className)}>
      <div
        className={styles.header}
        onClick={(event) => {
          if (!isOnControl(event)) {
            foldout.toggle(event);
          }
        }}
        onContextMenu={handleContextMenu}
        onKeyDown={handleKeyDown}
      >
        <button
          {...toggle}
          type="button"
          className={styles.toggle}
          aria-expanded={expanded}
          aria-controls={foldout.contentId}
          aria-labelledby={titleId}
          onClick={foldout.toggle}
          onKeyDown={foldout.handleKeyDown}
        >
          <FoldoutChevron expanded={expanded} />
          {icon !== undefined && <Icon icon={icon} />}
        </button>
        {enabled !== undefined && (
          <span className={styles.enabled} data-header-control="">
            <Checkbox
              aria-label={enabledLabel}
              checked={enabled}
              onCheckedChange={onEnabledChange}
            />
          </span>
        )}
        <span id={titleId} className={styles.title}>
          {title}
        </span>
        {onHelp !== undefined && (
          <IconButton size="sm" label={helpLabel} icon={frameworkIcons.help} onClick={onHelp} />
        )}
        {menuItems !== undefined && (
          <Menu
            items={menuItems}
            trigger={(triggerProps) => (
              <IconButton
                {...triggerProps}
                size="sm"
                label={menuLabel}
                icon={frameworkIcons['more-vertical']}
              />
            )}
          />
        )}
      </div>
      <FoldoutContext value={foldout.broadcast}>
        <div id={foldout.contentId} className={styles.content} hidden={!expanded}>
          {children}
        </div>
      </FoldoutContext>
      {menuItems !== undefined && (
        <Menu
          label={menuLabel}
          items={menuItems}
          point={menuPoint}
          onClose={() => {
            setMenuPoint(null);
          }}
        />
      )}
    </div>
  );
}
