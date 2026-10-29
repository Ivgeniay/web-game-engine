import { useEffect, useMemo, useRef } from 'react';
import type { ComponentPropsWithRef, KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { classNames } from '@/ui/classNames';
import { Icon } from '@/ui/icon/Icon';
import { ListRowContent } from '@/ui/listView/ListRowContent';
import type { TextRange } from '@/ui/listView/ListRowContent';
import type { ListBoxOwnProps, ListRowState } from '@/ui/listView/ListView';
import { PLAIN_GESTURE } from '@/ui/listView/listSelection';
import type { ListSelectionMode } from '@/ui/listView/listSelection';
import { useListBox } from '@/ui/listView/useListBox';
import type { ListInteraction, ListSelectionProps } from '@/ui/listView/useListInteraction';
import listStyles from '@/ui/listView/listBox.module.css';
import { useLocale } from '@/ui/locale/useLocale';
import { useIsMacPlatform } from '@/ui/platform/useIsMacPlatform';
import { useMergedRefs } from '@/ui/useMergedRefs';
import { findMatch } from './treeFilter';
import { collectExpandableSubtree, flattenTree, subtreeEnd } from './treeModel';
import type { TreeModel, TreeRow } from './treeModel';
import type { TreeDropPlacement } from './treeDrop';
import { treeKeyAction } from './treeNavigation';
import { TreeRenameField } from './TreeRenameField';
import type { RenameOutcome } from './TreeRenameField';
import { useTreeDragAndDrop } from './useTreeDragAndDrop';
import type { TreeDragProps } from './useTreeDragAndDrop';
import { useTreeFilter } from './useTreeFilter';
import styles from './TreeView.module.css';

export interface TreeRowState extends ListRowState {
  readonly depth: number;
  readonly hasChildren: boolean;
  readonly expanded: boolean;
  readonly match: TextRange | null;
}

export interface TreeExpansionProps {
  readonly expandedIds: readonly string[];
  readonly onExpandedIdsChange: (expandedIds: readonly string[]) => void;
}

export interface TreeRenameProps {
  readonly renamingId?: string | null | undefined;
  readonly onRenamingIdChange?: ((renamingId: string | null) => void) | undefined;
}

interface TreeViewProps
  extends
    Omit<ComponentPropsWithRef<'div'>, ListBoxOwnProps>,
    ListSelectionProps,
    TreeExpansionProps,
    TreeRenameProps,
    TreeDragProps {
  readonly model: TreeModel;
  readonly renderRow?: ((row: TreeRowState) => ReactNode) | undefined;
  readonly selectionMode?: ListSelectionMode | undefined;
  readonly filter?: string | undefined;
  readonly onRename?: ((id: string, name: string) => void) | undefined;
  readonly renameLabel?: string | undefined;
  readonly validateName?: ((name: string) => string | undefined) | undefined;
  readonly className?: string | undefined;
}

const RENAME_KEY = 'F2';
const MAC_RENAME_KEY = 'Enter';
const ROW_LABEL_SELECTOR = '[data-list-row-label]';
const NO_FILTER = '';
const NOT_FOUND = -1;

function indentWidth(depth: number): string {
  return `calc(${String(depth)} * var(--size-tree-indent))`;
}

function dropLineIndex({ target, rowIndex }: TreeDropPlacement): number | null {
  if (target.kind === 'root') {
    return rowIndex;
  }
  if (target.position === 'inside') {
    return null;
  }

  return target.position === 'before' ? rowIndex : rowIndex + 1;
}

function dropLine(placement: TreeDropPlacement, rowHeight: number) {
  const lineIndex = dropLineIndex(placement);

  if (lineIndex === null) {
    return null;
  }

  return (
    <div
      className={styles.dropLine}
      data-drop-line=""
      style={{
        left: indentWidth(placement.depth),
        transform: `translateY(${String(lineIndex * rowHeight)}px)`,
      }}
    />
  );
}

function isDropInside(placement: TreeDropPlacement | null, index: number): boolean {
  return (
    placement?.target.kind === 'node' &&
    placement.target.position === 'inside' &&
    placement.rowIndex === index
  );
}

function isOnLabel(event: MouseEvent<HTMLElement>): boolean {
  return event.target instanceof Element && event.target.closest(ROW_LABEL_SELECTOR) !== null;
}

function hasNoModifiers(event: KeyboardEvent<HTMLElement>): boolean {
  return !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey;
}

export function TreeView({
  model,
  renderRow,
  selectionMode = 'single',
  selectedIds,
  onSelectedIdsChange,
  focusedId,
  onFocusedIdChange,
  expandedIds,
  onExpandedIdsChange,
  filter = NO_FILTER,
  renamingId = null,
  onRenamingIdChange,
  onRename,
  renameLabel,
  validateName,
  dragType,
  dropTypes,
  canDropData,
  onDropData,
  getDragLabel,
  className,
  ref,
  ...nativeProps
}: TreeViewProps) {
  const locale = useLocale();
  const isMac = useIsMacPlatform();
  const containerRef = useRef<HTMLDivElement>(null);
  const returnFocusAfterRename = useRef(false);
  const treeFilter = useTreeFilter({
    model,
    filter,
    expandedIds,
    onExpandedIdsChange,
    selectedIds,
    focusedId,
    onFocusedIdChange,
  });
  const rows = useMemo(
    () => flattenTree(model, treeFilter.expandedSet, treeFilter.filter),
    [model, treeFilter.expandedSet, treeFilter.filter],
  );
  const itemIds = useMemo(() => rows.map(({ id }) => id), [rows]);
  const canRename = onRename !== undefined && onRenamingIdChange !== undefined;
  const renameKey = isMac ? MAC_RENAME_KEY : RENAME_KEY;

  function setExpanded(row: TreeRow, expanded: boolean, subtree: boolean): void {
    treeFilter.setExpanded(subtree ? collectExpandableSubtree(model, row.id) : [row.id], expanded);
  }

  function collapse(index: number, subtree: boolean, focusedIndex: number): void {
    const row = rows[index];

    if (row === undefined) {
      return;
    }
    if (focusedIndex > index && focusedIndex < subtreeEnd(rows, index)) {
      onFocusedIdChange(row.id);
    }

    setExpanded(row, false, subtree);
  }

  function startRename(id: string): void {
    if (canRename) {
      onRenamingIdChange(id);
    }
  }

  function handleTreeKey(event: KeyboardEvent<HTMLElement>, interaction: ListInteraction) {
    const row = rows[interaction.focusedIndex];

    if (canRename && event.key === renameKey && hasNoModifiers(event) && row !== undefined) {
      event.preventDefault();
      startRename(row.id);

      return true;
    }
    if (event.ctrlKey || event.metaKey) {
      return false;
    }

    const action = treeKeyAction(rows, interaction.focusedIndex, event);

    if (action === null) {
      return false;
    }

    event.preventDefault();

    if (action.kind === 'move') {
      interaction.moveFocus(action.index, PLAIN_GESTURE);
    } else if (action.kind === 'expand' && row !== undefined) {
      setExpanded(row, true, action.subtree);
    } else if (action.kind === 'collapse') {
      collapse(interaction.focusedIndex, action.subtree, interaction.focusedIndex);
    }

    return true;
  }

  const listBox = useListBox({
    ref: useMergedRefs(ref, containerRef),
    itemIds,
    getLabel: model.getLabel,
    selectionMode,
    selectedIds,
    onSelectedIdsChange,
    focusedId,
    onFocusedIdChange,
    handleOwnKey: handleTreeKey,
  });
  const { focusedIndex, selectedSet } = listBox.interaction;
  const { revealIndex, rowHeight } = listBox.virtualRows;
  const drag = useTreeDragAndDrop({
    dragType,
    dropTypes,
    canDropData,
    onDropData,
    getDragLabel,
    model,
    rows,
    selectedIds,
    containerRef,
    rowHeight,
    selectRow: (index) => {
      listBox.interaction.moveFocus(index, PLAIN_GESTURE);
    },
    expandRow: (id) => {
      treeFilter.setExpanded([id], true);
    },
  });
  const { placement } = drag;
  const renamingIndex = renamingId === null ? NOT_FOUND : itemIds.indexOf(renamingId);

  useEffect(() => {
    const id = treeFilter.takePendingReveal();
    const index = id === null ? NOT_FOUND : itemIds.indexOf(id);

    if (index !== NOT_FOUND) {
      revealIndex(index);
    }
  }, [treeFilter, itemIds, revealIndex]);

  useEffect(() => {
    if (renamingIndex !== NOT_FOUND) {
      revealIndex(renamingIndex);
    }
  }, [renamingIndex, revealIndex]);

  useEffect(() => {
    if (renamingId === null && returnFocusAfterRename.current) {
      returnFocusAfterRename.current = false;
      containerRef.current?.focus();
    }
  }, [renamingId]);

  function finishRename(row: TreeRow, label: string, { name, returnFocus }: RenameOutcome) {
    returnFocusAfterRename.current = returnFocus;

    if (name !== null && name !== label) {
      onRename?.(row.id, name);
    }

    onRenamingIdChange?.(null);
  }

  function handleToggleClick(event: MouseEvent<HTMLElement>, index: number, row: TreeRow) {
    event.stopPropagation();

    if (row.expanded) {
      collapse(index, event.altKey, focusedIndex);
    } else {
      setExpanded(row, true, event.altKey);
    }
  }

  function renderContent(row: TreeRow, state: TreeRowState) {
    const icon = model.getIcon?.(row.id, row.expanded);

    if (row.id === renamingId) {
      return (
        <TreeRenameField
          name={state.label}
          label={renameLabel ?? state.label}
          icon={icon}
          validate={validateName}
          onFinish={(outcome) => {
            finishRename(row, state.label, outcome);
          }}
        />
      );
    }

    return renderRow === undefined ? (
      <ListRowContent label={state.label} icon={icon} highlight={state.match} />
    ) : (
      renderRow(state)
    );
  }

  function renderRowAt(index: number) {
    const row = rows[index];

    if (row === undefined) {
      return null;
    }

    const { id, depth, hasChildren, expanded } = row;
    const label = model.getLabel(id);
    const matches = treeFilter.filter?.matchIds.has(id) === true;
    const state: TreeRowState = {
      id,
      index,
      label,
      selected: selectedSet.has(id),
      focused: index === focusedIndex,
      depth,
      hasChildren,
      expanded,
      match: matches ? findMatch(label, treeFilter.query, locale) : null,
    };

    return (
      <div
        key={id}
        role="treeitem"
        aria-level={depth + 1}
        aria-setsize={row.setSize}
        aria-posinset={row.posInSet}
        aria-expanded={hasChildren ? expanded : undefined}
        className={listStyles.row}
        data-drop-inside={isDropInside(placement, index) || undefined}
        {...listBox.getRowProps(index, id)}
        onPointerDown={(event) => {
          drag.startRowDrag(event, index);
        }}
        onDoubleClick={(event) => {
          if (isOnLabel(event)) {
            startRename(id);
          }
        }}
      >
        <span className={styles.indent} style={{ width: indentWidth(depth) }} />
        <span
          className={styles.toggle}
          aria-hidden
          data-tree-toggle=""
          onClick={
            hasChildren
              ? (event) => {
                  handleToggleClick(event, index, row);
                }
              : undefined
          }
        >
          {hasChildren && (
            <Icon
              icon={expanded ? frameworkIcons['chevron-down'] : frameworkIcons['chevron-right']}
              size="sm"
            />
          )}
        </span>
        {renderContent(row, state)}
      </div>
    );
  }

  const indexes =
    renamingIndex === NOT_FOUND || listBox.renderedIndexes.includes(renamingIndex)
      ? listBox.renderedIndexes
      : [...listBox.renderedIndexes, renamingIndex];

  return (
    <div
      {...nativeProps}
      {...listBox.containerProps}
      {...drag.dropTargetProps}
      role="tree"
      className={classNames(listStyles.root, styles.tree, className)}
    >
      <div className={listStyles.rows} style={listBox.rowsStyle}>
        {indexes.map(renderRowAt)}
        {placement !== null && dropLine(placement, rowHeight)}
      </div>
    </div>
  );
}
