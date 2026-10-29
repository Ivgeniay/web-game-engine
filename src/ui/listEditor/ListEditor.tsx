import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import type { ValueChangeHandler, ValueChangePhase } from '@/contracts/valueChange';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { classNames } from '@/ui/classNames';
import { useDragSource } from '@/ui/dragAndDrop/useDragSource';
import { useDropTarget } from '@/ui/dragAndDrop/useDropTarget';
import { FoldoutChevron } from '@/ui/foldout/FoldoutChevron';
import { FoldoutContext } from '@/ui/foldout/foldoutContext';
import { useFoldout } from '@/ui/foldout/useFoldout';
import { Icon } from '@/ui/icon/Icon';
import { IconButton } from '@/ui/iconButton/IconButton';
import { NumberField } from '@/ui/numberField/NumberField';
import type { NumberFieldMessages } from '@/ui/numberField/numberText';
import styles from './ListEditor.module.css';
import {
  dropIndex,
  insertionIndexAt,
  moveItem,
  removeItem,
  replaceItem,
  resizeItems,
} from './listOperations';

export interface ListEditorLabels {
  readonly size: string;
  readonly add: string;
  readonly empty: string;
  readonly itemLabel: (index: number) => string;
  readonly moveItem: (index: number) => string;
  readonly removeItem: (index: number) => string;
  readonly sizeMessages: NumberFieldMessages;
}

export interface ListEditorItemProps<T> {
  readonly item: T;
  readonly index: number;
  readonly label: string;
  readonly disabled: boolean;
  readonly onItemChange: ValueChangeHandler<T>;
}

interface ListEditorProps<T> {
  readonly label: string;
  readonly value: readonly T[];
  readonly onValueChange?: ValueChangeHandler<readonly T[]> | undefined;
  readonly renderItem: (props: ListEditorItemProps<T>) => ReactNode;
  readonly createItem: () => T;
  readonly getItemKey?: ((item: T, index: number) => string) | undefined;
  readonly expanded: boolean;
  readonly onExpandedChange: (expanded: boolean) => void;
  readonly mixed?: boolean | undefined;
  readonly disabled?: boolean | undefined;
  readonly labels: ListEditorLabels;
  readonly className?: string | undefined;
}

type FocusTarget =
  | { readonly kind: 'handle'; readonly index: number }
  | { readonly kind: 'remove'; readonly index: number }
  | { readonly kind: 'add' };

const DRAG_TYPE_PREFIX = 'framework.list-item:';
const ROW_ATTRIBUTE = 'data-list-editor-row';
const HANDLE_ATTRIBUTE = 'data-list-editor-handle';
const REMOVE_ATTRIBUTE = 'data-list-editor-remove';
const ADD_ATTRIBUTE = 'data-list-editor-add';
const MOVE_DIRECTIONS: Readonly<Record<string, number>> = { ArrowUp: -1, ArrowDown: 1 };
const HALF = 2;

function indexKey(_item: unknown, index: number): string {
  return String(index);
}

function focusSelector(target: FocusTarget): string {
  switch (target.kind) {
    case 'handle':
      return `[${HANDLE_ATTRIBUTE}="${String(target.index)}"]`;
    case 'remove':
      return `[${REMOVE_ATTRIBUTE}="${String(target.index)}"]`;
    case 'add':
      return `[${ADD_ATTRIBUTE}]`;
  }
}

function rowMiddles(list: HTMLElement): readonly number[] {
  return Array.from(list.querySelectorAll(`[${ROW_ATTRIBUTE}]`), (row) => {
    const { top, height } = row.getBoundingClientRect();

    return top + height / HALF;
  });
}

export function ListEditor<T>({
  label,
  value,
  onValueChange,
  renderItem,
  createItem,
  getItemKey = indexKey,
  expanded,
  onExpandedChange,
  mixed = false,
  disabled = false,
  labels,
  className,
}: ListEditorProps<T>) {
  const foldout = useFoldout({ expanded, onExpandedChange });
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<FocusTarget | null>(null);
  const [insertionIndex, setInsertionIndex] = useState<number | null>(null);
  const dragType = `${DRAG_TYPE_PREFIX}${useId()}`;
  const editable = !disabled && !mixed;
  const dragSource = useDragSource({ enabled: editable });
  const dropTarget = useDropTarget({
    enabled: editable,
    accepts: [dragType],
    onDragOver: (_data, point) => {
      if (listRef.current !== null) {
        setInsertionIndex(insertionIndexAt(rowMiddles(listRef.current), point.clientY));
      }

      return true;
    },
    onDragLeave: () => {
      setInsertionIndex(null);
    },
    onDrop: (data, point) => {
      setInsertionIndex(null);
      const from = Number(data.ids[0]);

      if (listRef.current !== null) {
        const to = dropIndex(insertionIndexAt(rowMiddles(listRef.current), point.clientY), from);
        commit(moveItem(value, from, to), { kind: 'handle', index: to });
      }
    },
  });

  useEffect(() => {
    const target = focusRef.current;
    focusRef.current = null;

    if (target !== null) {
      const element = rootRef.current?.querySelector(focusSelector(target));

      if (element instanceof HTMLElement) {
        element.focus();
      }
    }
  });

  function commit(next: readonly T[], focus: FocusTarget | null): void {
    focusRef.current = focus;
    onValueChange?.(next, 'commit');
  }

  function changeItem(index: number, item: T, phase: ValueChangePhase): void {
    onValueChange?.(replaceItem(value, index, item), phase);
  }

  function moveWithKeys(event: KeyboardEvent<HTMLButtonElement>, index: number): void {
    const direction = MOVE_DIRECTIONS[event.key];

    if (!event.altKey || direction === undefined) {
      return;
    }

    event.preventDefault();
    const to = index + direction;

    if (to >= 0 && to < value.length) {
      commit(moveItem(value, index, to), { kind: 'handle', index: to });
    }
  }

  function removeAt(index: number): void {
    const next = removeItem(value, index);
    const focus: FocusTarget =
      next.length === 0
        ? { kind: 'add' }
        : { kind: 'remove', index: Math.min(index, next.length - 1) };
    commit(next, focus);
  }

  const lineIndex = insertionIndex ?? -1;

  return (
    <div ref={rootRef} className={classNames(styles.root, className)}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={expanded}
          aria-controls={foldout.contentId}
          disabled={disabled}
          onClick={foldout.toggle}
          onKeyDown={foldout.handleKeyDown}
        >
          <FoldoutChevron expanded={expanded} />
          <span className={styles.label}>{label}</span>
        </button>
        <NumberField
          className={styles.size}
          aria-label={labels.size}
          kind="integer"
          min={0}
          value={value.length}
          mixed={mixed}
          disabled={!editable}
          invalidMessages={labels.sizeMessages}
          onValueChange={(size, phase) => {
            if (phase === 'commit' && size !== value.length) {
              commit(resizeItems(value, size, createItem), null);
            }
          }}
        />
      </div>
      <FoldoutContext value={foldout.broadcast}>
        <div id={foldout.contentId} className={styles.content} hidden={!expanded}>
          {!mixed && value.length === 0 && <span className={styles.empty}>{labels.empty}</span>}
          {!mixed && value.length > 0 && (
            <div
              {...dropTarget.dropTargetProps}
              ref={listRef}
              role="list"
              aria-label={label}
              className={styles.list}
            >
              {value.map((item, index) => {
                const itemLabel = labels.itemLabel(index);

                return (
                  <div
                    key={getItemKey(item, index)}
                    role="listitem"
                    className={styles.row}
                    {...{ [ROW_ATTRIBUTE]: '' }}
                    data-drop-before={lineIndex === index ? '' : undefined}
                    data-drop-after={
                      lineIndex === value.length && index === value.length - 1 ? '' : undefined
                    }
                  >
                    <button
                      type="button"
                      className={styles.handle}
                      aria-label={labels.moveItem(index)}
                      disabled={!editable}
                      {...{ [HANDLE_ATTRIBUTE]: String(index) }}
                      onPointerDown={(event) => {
                        dragSource.startDrag(event, () => ({
                          type: dragType,
                          ids: [String(index)],
                          label: itemLabel,
                        }));
                      }}
                      onKeyDown={(event) => {
                        moveWithKeys(event, index);
                      }}
                    >
                      <Icon icon={frameworkIcons['drag-handle']} />
                    </button>
                    <div className={styles.item}>
                      {renderItem({
                        item,
                        index,
                        label: itemLabel,
                        disabled: !editable,
                        onItemChange: (next, phase) => {
                          changeItem(index, next, phase);
                        },
                      })}
                    </div>
                    <IconButton
                      label={labels.removeItem(index)}
                      icon={frameworkIcons.minus}
                      size="sm"
                      disabled={!editable}
                      {...{ [REMOVE_ATTRIBUTE]: String(index) }}
                      onClick={() => {
                        removeAt(index);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
          <div className={styles.footer}>
            <IconButton
              label={labels.add}
              icon={frameworkIcons.plus}
              size="sm"
              disabled={!editable}
              {...{ [ADD_ATTRIBUTE]: '' }}
              onClick={() => {
                commit([...value, createItem()], null);
              }}
            />
          </div>
        </div>
      </FoldoutContext>
    </div>
  );
}
