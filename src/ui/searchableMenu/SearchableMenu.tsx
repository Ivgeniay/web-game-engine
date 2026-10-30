import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { classNames } from '@/ui/classNames';
import { Icon } from '@/ui/icon/Icon';
import { IconButton } from '@/ui/iconButton/IconButton';
import { useLocale } from '@/ui/locale/useLocale';
import { Popover } from '@/ui/popover/Popover';
import type { PopoverTriggerProps } from '@/ui/popover/Popover';
import { POPUP_BLOCKS_TOOLTIPS_PROPS } from '@/ui/popup/popupLayerAttributes';
import { SearchField } from '@/ui/searchField/SearchField';
import styles from './SearchableMenu.module.css';
import {
  NO_ROW,
  firstEnabledRow,
  groupLabels,
  nextEnabledRow,
  rowsInGroup,
  searchRows,
} from './searchableMenuModel';
import type { SearchableMenuItem, SearchableMenuRow } from './searchableMenuModel';

export interface SearchableMenuLabels {
  readonly search: string;
  readonly clearSearch: string;
  readonly back: string;
}

interface SearchableMenuProps {
  readonly label: string;
  readonly items: readonly SearchableMenuItem[];
  readonly onSelect: (id: string) => void;
  readonly trigger: (triggerProps: PopoverTriggerProps) => ReactNode;
  readonly labels: SearchableMenuLabels;
  readonly className?: string | undefined;
}

interface MenuPanelProps {
  readonly label: string;
  readonly items: readonly SearchableMenuItem[];
  readonly labels: SearchableMenuLabels;
  readonly onChoose: (id: string) => void;
}

const PATH_SEPARATOR = ' / ';

function MenuPanel({ label, items, labels, onChoose }: MenuPanelProps) {
  const locale = useLocale();
  const listId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const [groupPath, setGroupPath] = useState<readonly string[]>([]);
  const [query, setQuery] = useState('');
  const searching = query.trim() !== '';
  const rows = searching ? searchRows(items, query, locale) : rowsInGroup(items, groupPath);
  const [activeIndex, setActiveIndex] = useState(NO_ROW);
  const active =
    activeIndex === NO_ROW || activeIndex >= rows.length ? firstEnabledRow(rows) : activeIndex;
  const title = groupLabels(items, groupPath).at(-1) ?? label;

  function rowId(index: number): string {
    return `${listId}-${String(index)}`;
  }

  useEffect(() => {
    const list = listRef.current;
    const row = active === NO_ROW ? null : document.getElementById(rowId(active));

    if (list === null || row === null) {
      return;
    }

    if (row.offsetTop < list.scrollTop) {
      list.scrollTop = row.offsetTop;
    } else if (row.offsetTop + row.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = row.offsetTop + row.offsetHeight - list.clientHeight;
    }
  });

  function showGroup(path: readonly string[]): void {
    setGroupPath(path);
    setQuery('');
    setActiveIndex(NO_ROW);
  }

  function activate(row: SearchableMenuRow | undefined): void {
    if (row === undefined || row.item.disabled === true) {
      return;
    }

    if (row.group) {
      showGroup([...groupPath, row.item.id]);
    } else {
      onChoose(row.item.id);
    }
  }

  function goBack(): void {
    if (groupPath.length > 0) {
      showGroup(groupPath.slice(0, -1));
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    const backKey = event.key === 'ArrowLeft' || event.key === 'Backspace';

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex(nextEnabledRow(rows, active, event.key === 'ArrowDown' ? 1 : -1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      activate(rows[active]);
    } else if (event.key === 'ArrowRight' && !searching && rows[active]?.group === true) {
      event.preventDefault();
      activate(rows[active]);
    } else if (backKey && query === '' && groupPath.length > 0) {
      event.preventDefault();
      goBack();
    }
  }

  return (
    <div className={styles.panel}>
      <SearchField
        label={labels.search}
        clearLabel={labels.clearSearch}
        value={query}
        onValueChange={(next) => {
          setQuery(next);
          setActiveIndex(NO_ROW);
        }}
        role="combobox"
        aria-expanded
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active === NO_ROW ? undefined : rowId(active)}
        onKeyDown={handleKeyDown}
      />
      <div className={styles.header}>
        {groupPath.length > 0 && !searching && (
          <IconButton
            size="sm"
            label={labels.back}
            icon={frameworkIcons['arrow-left']}
            onClick={goBack}
          />
        )}
        <span className={styles.title}>{title}</span>
      </div>
      <div
        {...POPUP_BLOCKS_TOOLTIPS_PROPS}
        ref={listRef}
        id={listId}
        role="listbox"
        aria-label={title}
        className={styles.list}
      >
        {rows.map((row, index) => (
          <div
            key={row.item.id}
            id={rowId(index)}
            role="option"
            aria-selected={index === active}
            aria-disabled={row.item.disabled === true || undefined}
            className={classNames(styles.row, index === active && styles.active)}
            onMouseDown={(event) => {
              event.preventDefault();
            }}
            onMouseMove={() => {
              if (row.item.disabled !== true && index !== active) {
                setActiveIndex(index);
              }
            }}
            onClick={() => {
              activate(row);
            }}
          >
            <span className={styles.icon}>
              {row.item.icon !== undefined && <Icon icon={row.item.icon} />}
            </span>
            <span className={styles.label}>{row.item.label}</span>
            {row.path.length > 0 && (
              <span className={styles.path}>{row.path.join(PATH_SEPARATOR)}</span>
            )}
            {row.group && (
              <span className={styles.icon}>
                <Icon icon={frameworkIcons['chevron-right']} />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SearchableMenu({
  label,
  items,
  onSelect,
  trigger,
  labels,
  className,
}: SearchableMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      label={label}
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      className={className}
    >
      <MenuPanel
        label={label}
        items={items}
        labels={labels}
        onChoose={(id) => {
          setOpen(false);
          onSelect(id);
        }}
      />
    </Popover>
  );
}
