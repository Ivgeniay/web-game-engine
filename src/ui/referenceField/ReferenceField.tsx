import type { KeyboardEvent, Ref } from 'react';
import type { DragData } from '@/contracts/dragData';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import { frameworkIcons } from '@/icons/frameworkIcons';
import type { IconSource } from '@/icons/icon';
import { classNames } from '@/ui/classNames';
import { useDropTarget } from '@/ui/dragAndDrop/useDropTarget';
import { Icon } from '@/ui/icon/Icon';
import { IconButton } from '@/ui/iconButton/IconButton';
import { RovingFocusContext } from '@/ui/rovingFocus/rovingFocusContext';
import { useRovingFocusItem } from '@/ui/rovingFocus/useRovingFocusItem';
import {
  MIXED_VALUE_PLACEHOLDER,
  fieldBoxClassName,
  fieldInputClassName,
} from '@/ui/textField/fieldBox';
import styles from './ReferenceField.module.css';

export interface ReferenceFieldLabels {
  readonly none: string;
  readonly openPicker: string;
  readonly clear: string;
}

interface ReferenceFieldBaseProps {
  readonly value: string | null;
  readonly onValueChange?: ValueChangeHandler<string | null> | undefined;
  readonly onOpenPicker: () => void;
  readonly getLabel: (id: string) => string;
  readonly getIcon?: ((id: string) => IconSource | undefined) | undefined;
  readonly labels: ReferenceFieldLabels;
  readonly dropTypes?: readonly string[] | undefined;
  readonly resolveDrop?: ((data: DragData) => string | null) | undefined;
  readonly mixed?: boolean | undefined;
  readonly disabled?: boolean | undefined;
  readonly readOnly?: boolean | undefined;
  readonly id?: string | undefined;
  readonly className?: string | undefined;
  readonly ref?: Ref<HTMLButtonElement> | undefined;
}

interface ReferenceFieldAriaLabel {
  readonly 'aria-label': string;
  readonly 'aria-labelledby'?: never;
}

interface ReferenceFieldAriaLabelledBy {
  readonly 'aria-label'?: never;
  readonly 'aria-labelledby': string;
}

type ReferenceFieldProps = ReferenceFieldBaseProps &
  (ReferenceFieldAriaLabel | ReferenceFieldAriaLabelledBy);

const CLEAR_KEYS: ReadonlySet<string> = new Set(['Delete', 'Backspace']);
const NOT_TABBABLE = -1;
const NO_DROP_TYPES: readonly string[] = [];

function resolveNothing(): null {
  return null;
}

export function ReferenceField({
  value,
  onValueChange,
  onOpenPicker,
  getLabel,
  getIcon,
  labels,
  dropTypes = NO_DROP_TYPES,
  resolveDrop = resolveNothing,
  mixed = false,
  disabled = false,
  readOnly = false,
  id,
  className,
  ref,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: ReferenceFieldProps) {
  const editable = !disabled && !readOnly;
  const rovingProps = useRovingFocusItem<HTMLButtonElement>({
    ref,
    tabIndex: undefined,
    onFocus: undefined,
    disabled,
    preferred: false,
  });
  const dropTarget = useDropTarget({
    enabled: editable && dropTypes.length > 0,
    accepts: dropTypes,
    onDragOver: (data) => resolveDrop(data) !== null,
    onDrop: (data) => {
      const target = resolveDrop(data);

      if (target !== null) {
        onValueChange?.(target, 'commit');
      }
    },
  });
  const canClear = editable && !mixed && value !== null;
  const icon = mixed || value === null ? undefined : getIcon?.(value);
  let text = labels.none;

  if (mixed) {
    text = MIXED_VALUE_PLACEHOLDER;
  } else if (value !== null) {
    text = getLabel(value);
  }

  function clear(): void {
    onValueChange?.(null, 'commit');
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (
      canClear &&
      CLEAR_KEYS.has(event.key) &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      event.preventDefault();
      clear();
    }
  }

  return (
    <span
      {...dropTarget.dropTargetProps}
      className={fieldBoxClassName({
        size: 'md',
        invalid: false,
        disabled,
        readOnly,
        className: classNames(
          styles.root,
          canClear && styles.clearable,
          dropTarget.isOver && styles.dropTarget,
          className,
        ),
      })}
    >
      <button
        {...rovingProps}
        id={id}
        type="button"
        className={classNames(fieldInputClassName, styles.target)}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-description={labels.openPicker}
        onClick={() => {
          if (editable) {
            onOpenPicker();
          }
        }}
        onKeyDown={handleKeyDown}
      >
        {icon !== undefined && (
          <span className={styles.icon}>
            <Icon icon={icon} />
          </span>
        )}
        <span className={styles.name} data-empty={value === null && !mixed ? '' : undefined}>
          {text}
        </span>
        {editable && (
          <span className={styles.pick}>
            <Icon icon={frameworkIcons.search} size="sm" />
          </span>
        )}
      </button>
      {canClear && (
        <RovingFocusContext value={null}>
          <IconButton
            className={styles.clear}
            label={labels.clear}
            icon={frameworkIcons.close}
            size="sm"
            tabIndex={NOT_TABBABLE}
            onClick={clear}
          />
        </RovingFocusContext>
      )}
    </span>
  );
}
