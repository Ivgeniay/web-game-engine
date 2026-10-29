import { useMemo, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import type { ThumbnailLoader } from '@/contracts/thumbnail';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import { frameworkIcons } from '@/icons/frameworkIcons';
import type { IconSource } from '@/icons/icon';
import { Button } from '@/ui/button/Button';
import { Dialog } from '@/ui/dialog/Dialog';
import { GridView } from '@/ui/gridView/GridView';
import {
  GRID_CELL_SIZE_DEFAULT,
  GRID_CELL_SIZE_MAX,
  GRID_CELL_SIZE_MIN,
} from '@/ui/gridView/gridScale';
import { useLocale } from '@/ui/locale/useLocale';
import { SearchField } from '@/ui/searchField/SearchField';
import { Slider } from '@/ui/slider/Slider';
import { ToggleButtonGroup } from '@/ui/toggleButtonGroup/ToggleButtonGroup';
import styles from './PickerDialog.module.css';
import { NONE_ITEM_ID, filterPickerItems, itemIdOf, valueOfItem } from './pickerItems';

export interface PickerDialogLabels {
  readonly search: string;
  readonly clearSearch: string;
  readonly tabs: string;
  readonly view: string;
  readonly listView: string;
  readonly gridView: string;
  readonly scale: string;
  readonly results: string;
  readonly none: string;
  readonly select: string;
  readonly cancel: string;
}

export interface PickerTab {
  readonly id: string;
  readonly label: string;
  readonly getItemIds: () => readonly string[];
}

interface PickerDialogProps {
  readonly open: boolean;
  readonly title: string;
  readonly value: string | null;
  readonly onValueChange: ValueChangeHandler<string | null>;
  readonly onClose: () => void;
  readonly tabs: readonly PickerTab[];
  readonly getLabel: (id: string) => string;
  readonly getIcon?: ((id: string) => IconSource | undefined) | undefined;
  readonly loadThumbnail?: ThumbnailLoader | undefined;
  readonly labels: PickerDialogLabels;
}

type PickerView = 'grid' | 'list';

const OPTION_SELECTOR = '[role="option"]';

function isOnOption(event: MouseEvent<HTMLElement>): boolean {
  return event.target instanceof Element && event.target.closest(OPTION_SELECTOR) !== null;
}

function OpenPickerDialog({
  title,
  value,
  onValueChange,
  onClose,
  tabs,
  getLabel,
  getIcon,
  loadThumbnail,
  labels,
}: PickerDialogProps) {
  const locale = useLocale();
  const [original] = useState(value);
  const [query, setQuery] = useState('');
  const [tabId, setTabId] = useState(tabs[0]?.id ?? '');
  const [view, setView] = useState<PickerView>('grid');
  const [cellSize, setCellSize] = useState(GRID_CELL_SIZE_DEFAULT);
  const [focusedId, setFocusedId] = useState<string | null>(itemIdOf(value));
  const searchRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const tab = tabs.find((candidate) => candidate.id === tabId) ?? tabs[0];
  const itemIds = useMemo(
    () => filterPickerItems(tab?.getItemIds() ?? [], query, getLabel, locale),
    [tab, query, getLabel, locale],
  );

  function labelOf(id: string): string {
    return id === NONE_ITEM_ID ? labels.none : getLabel(id);
  }

  function iconOf(id: string): IconSource | undefined {
    return id === NONE_ITEM_ID ? frameworkIcons.close : getIcon?.(id);
  }

  function commit(): void {
    onValueChange(value, 'commit');
    onClose();
  }

  function cancel(): void {
    onValueChange(original, 'cancel');
    onClose();
  }

  return (
    <Dialog
      open
      title={title}
      className={styles.body}
      initialFocus={searchRef}
      onClose={cancel}
      onSubmit={commit}
      actions={
        <>
          <Button onClick={cancel}>{labels.cancel}</Button>
          <Button type="submit" variant="accent">
            {labels.select}
          </Button>
        </>
      }
    >
      <div className={styles.toolbar}>
        {tabs.length > 1 && (
          <ToggleButtonGroup
            label={labels.tabs}
            selection="single"
            options={tabs.map(({ id, label }) => ({ value: id, label }))}
            value={tab?.id ?? ''}
            onValueChange={setTabId}
          />
        )}
        <SearchField
          ref={searchRef}
          className={styles.search}
          label={labels.search}
          clearLabel={labels.clearSearch}
          value={query}
          onValueChange={setQuery}
          resultsRef={resultsRef}
        />
        <ToggleButtonGroup
          label={labels.view}
          selection="single"
          options={[
            {
              value: 'list',
              label: labels.listView,
              icon: frameworkIcons['list-view'],
              iconOnly: true,
            },
            {
              value: 'grid',
              label: labels.gridView,
              icon: frameworkIcons['grid-view'],
              iconOnly: true,
            },
          ]}
          value={view}
          onValueChange={setView}
        />
      </div>
      <GridView
        ref={resultsRef}
        aria-label={labels.results}
        className={styles.results}
        itemIds={itemIds}
        getLabel={labelOf}
        getIcon={iconOf}
        loadThumbnail={loadThumbnail}
        cellSize={view === 'list' ? GRID_CELL_SIZE_MIN : cellSize}
        selectedIds={[itemIdOf(value)]}
        onSelectedIdsChange={(ids) => {
          const [id] = ids;

          if (id !== undefined) {
            onValueChange(valueOfItem(id), 'preview');
          }
        }}
        focusedId={focusedId}
        onFocusedIdChange={setFocusedId}
        onDoubleClick={(event) => {
          if (isOnOption(event)) {
            commit();
          }
        }}
      />
      {view === 'grid' && (
        <Slider
          aria-label={labels.scale}
          className={styles.scale}
          value={cellSize}
          min={GRID_CELL_SIZE_MIN + 1}
          max={GRID_CELL_SIZE_MAX}
          step={1}
          kind="integer"
          showField={false}
          onValueChange={setCellSize}
        />
      )}
    </Dialog>
  );
}

export function PickerDialog(props: PickerDialogProps) {
  return props.open ? <OpenPickerDialog {...props} /> : null;
}
