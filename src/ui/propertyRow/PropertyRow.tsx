import { useId, useState } from 'react';
import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';
import type { PropertyRowSlots } from '@/contracts/property';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { classNames } from '@/ui/classNames';
import { IconButton } from '@/ui/iconButton/IconButton';
import { Label } from '@/ui/label/Label';
import { Menu } from '@/ui/menu/Menu';
import type { MenuPoint } from '@/ui/menu/menuItems';
import { isTextEntry } from '@/ui/textEntry';
import { useValueDrag } from '@/ui/valueDrag/useValueDrag';
import type { ValueDragTarget } from '@/ui/valueDrag/useValueDrag';
import styles from './PropertyRow.module.css';

export interface PropertyFieldProps {
  readonly id: string;
  readonly labelId: string;
}

interface PropertyRowProps extends PropertyRowSlots {
  readonly label: string;
  readonly children: (field: PropertyFieldProps) => ReactNode;
  readonly drag?: ValueDragTarget | undefined;
  readonly disabled?: boolean | undefined;
  readonly depth?: number | undefined;
  readonly className?: string | undefined;
}

const SECONDARY_BUTTON = 2;
const CONTEXT_MENU_KEY = 'ContextMenu';
const SHIFT_F10_KEY = 'F10';
const NO_DEPTH = 0;

function pointBelow(target: EventTarget, fallback: HTMLElement): MenuPoint {
  const anchor = target instanceof Element ? target : fallback;
  const { left, bottom } = anchor.getBoundingClientRect();

  return { x: left, y: bottom };
}

function isMenuKey(event: KeyboardEvent<HTMLElement>): boolean {
  return (
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey &&
    (event.key === CONTEXT_MENU_KEY || (event.shiftKey && event.key === SHIFT_F10_KEY))
  );
}

export function PropertyRow({
  label,
  children,
  drag,
  disabled = false,
  depth = NO_DEPTH,
  modified,
  reset,
  menuItems,
  className,
}: PropertyRowProps) {
  const id = useId();
  const labelId = useId();
  const [menuPoint, setMenuPoint] = useState<MenuPoint | null>(null);
  const { dragging, zoneProps } = useValueDrag(drag, disabled);
  const hasMenu = menuItems !== undefined && menuItems.length > 0;

  function opensMenu(event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>): boolean {
    return hasMenu && !event.defaultPrevented && !isTextEntry(event.target);
  }

  return (
    <div
      className={classNames(styles.root, className)}
      data-markable={modified === undefined ? undefined : ''}
      data-modified={modified === true ? '' : undefined}
      onContextMenu={(event) => {
        if (!opensMenu(event)) {
          return;
        }

        event.preventDefault();
        setMenuPoint(
          event.button === SECONDARY_BUTTON
            ? { x: event.clientX, y: event.clientY }
            : pointBelow(event.target, event.currentTarget),
        );
      }}
      onKeyDown={(event) => {
        if (isMenuKey(event) && opensMenu(event)) {
          event.preventDefault();
          setMenuPoint(pointBelow(event.target, event.currentTarget));
        }
      }}
    >
      <div
        className={styles.labelCell}
        style={
          depth > NO_DEPTH
            ? { paddingInlineStart: `calc(var(--space-12) * ${String(depth)})` }
            : undefined
        }
      >
        <span
          {...zoneProps}
          className={classNames(styles.label, zoneProps.className)}
          data-dragging={dragging ? '' : undefined}
        >
          <Label id={labelId} htmlFor={id} tone={disabled ? 'disabled' : 'primary'} truncate>
            {label}
          </Label>
        </span>
      </div>
      <div className={styles.field}>{children({ id, labelId })}</div>
      {reset !== undefined && (
        <span
          className={styles.reset}
          inert={modified !== true}
          data-unavailable={modified === true ? undefined : ''}
        >
          <IconButton
            size="sm"
            label={reset.label}
            icon={frameworkIcons.reset}
            disabled={disabled}
            onClick={reset.onReset}
          />
        </span>
      )}
      {hasMenu && (
        <Menu
          label={label}
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
