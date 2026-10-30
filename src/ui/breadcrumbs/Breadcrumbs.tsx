import { useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { Button } from '@/ui/button/Button';
import { classNames } from '@/ui/classNames';
import { Icon } from '@/ui/icon/Icon';
import { IconButton } from '@/ui/iconButton/IconButton';
import { Menu } from '@/ui/menu/Menu';
import type { MenuTriggerProps } from '@/ui/menu/Menu';
import { RovingFocusContext } from '@/ui/rovingFocus/rovingFocusContext';
import { useRovingFocusGroup } from '@/ui/rovingFocus/useRovingFocusGroup';
import styles from './Breadcrumbs.module.css';
import { countCollapsed, layoutBreadcrumbs } from './breadcrumbsLayout';

export interface BreadcrumbItem {
  readonly id: string;
  readonly label: string;
}

interface BreadcrumbsProps {
  readonly label: string;
  readonly items: readonly BreadcrumbItem[];
  readonly onNavigate: (id: string) => void;
  readonly moreLabel: string;
  readonly className?: string | undefined;
}

const SEGMENT_SELECTOR = '[data-breadcrumb-segment]';
const MORE_SELECTOR = '[data-breadcrumb-more]';
const NOT_TABBABLE = -1;

function Separator() {
  return (
    <span className={styles.separator} aria-hidden="true">
      <Icon icon={frameworkIcons['chevron-right']} size="sm" />
    </span>
  );
}

function widthOf(element: Element | null): number {
  return element?.getBoundingClientRect().width ?? 0;
}

export function Breadcrumbs({ label, items, onNavigate, moreLabel, className }: BreadcrumbsProps) {
  const { registry, onKeyDown } = useRovingFocusGroup({ orientation: 'horizontal' });
  const listRef = useRef<HTMLOListElement>(null);
  const measureRef = useRef<HTMLOListElement>(null);
  const [collapsed, setCollapsed] = useState(0);
  const { first, hidden, visible } = layoutBreadcrumbs(items, collapsed);
  const lastId = items.at(-1)?.id;

  useLayoutEffect(() => {
    const list = listRef.current;
    const measure = measureRef.current;

    if (list === null || measure === null) {
      return undefined;
    }

    const observer = new ResizeObserver(() => {
      const segments = [...measure.querySelectorAll(SEGMENT_SELECTOR)].map(widthOf);

      setCollapsed(
        countCollapsed(segments, widthOf(measure.querySelector(MORE_SELECTOR)), list.clientWidth),
      );
    });
    observer.observe(list);
    observer.observe(measure);

    return () => {
      observer.disconnect();
    };
  }, []);

  function crumbButton(item: BreadcrumbItem, tabIndex?: number): ReactNode {
    const current = item.id === lastId;

    return (
      <Button
        variant="flat"
        size="sm"
        className={classNames(styles.crumb, current && styles.current)}
        aria-current={current ? 'location' : undefined}
        tabIndex={tabIndex}
        onClick={() => {
          onNavigate(item.id);
        }}
      >
        {item.label}
      </Button>
    );
  }

  function moreButton(triggerProps?: MenuTriggerProps, tabIndex?: number): ReactNode {
    return (
      <IconButton
        {...triggerProps}
        tabIndex={tabIndex}
        size="sm"
        variant="flat"
        label={moreLabel}
        icon={frameworkIcons['more-vertical']}
      />
    );
  }

  return (
    <nav className={classNames(styles.root, className)} aria-label={label}>
      <RovingFocusContext value={registry}>
        <ol ref={listRef} className={styles.list} onKeyDown={onKeyDown}>
          {first !== undefined && <li className={styles.item}>{crumbButton(first)}</li>}
          {hidden.length > 0 && (
            <li className={styles.item}>
              <Separator />
              <Menu
                items={hidden.map((item) => ({
                  kind: 'action',
                  id: item.id,
                  label: item.label,
                  onSelect: () => {
                    onNavigate(item.id);
                  },
                }))}
                trigger={(triggerProps) => moreButton(triggerProps)}
              />
            </li>
          )}
          {visible.map((item) => (
            <li key={item.id} className={styles.item}>
              <Separator />
              {crumbButton(item)}
            </li>
          ))}
        </ol>
      </RovingFocusContext>
      <RovingFocusContext value={null}>
        <ol ref={measureRef} className={styles.measure} aria-hidden="true" inert>
          {items.map((item, index) => (
            <li key={item.id} className={styles.item} data-breadcrumb-segment="">
              {index > 0 && <Separator />}
              {crumbButton(item, NOT_TABBABLE)}
            </li>
          ))}
          <li className={styles.item} data-breadcrumb-more="">
            <Separator />
            {moreButton(undefined, NOT_TABBABLE)}
          </li>
        </ol>
      </RovingFocusContext>
    </nav>
  );
}
