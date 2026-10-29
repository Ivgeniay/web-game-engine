import type { Ref } from 'react';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import { frameworkIcons } from '@/icons/frameworkIcons';
import {
  BUTTON_ICON_SIZES,
  buttonClassName,
  buttonLabelClassName,
} from '@/ui/button/buttonClassName';
import type { ButtonSize } from '@/ui/button/buttonClassName';
import { classNames } from '@/ui/classNames';
import { Icon } from '@/ui/icon/Icon';
import { Menu } from '@/ui/menu/Menu';
import type { MenuTriggerProps } from '@/ui/menu/Menu';
import type { MenuItem } from '@/ui/menu/menuItems';
import { useRovingFocusItem } from '@/ui/rovingFocus/useRovingFocusItem';
import { useMergedRefs } from '@/ui/useMergedRefs';
import styles from './FlagsField.module.css';
import {
  flagCheckedState,
  flagsSummary,
  hasAllFlags,
  hasNoFlags,
  setAllFlags,
  toggleFlag,
} from './flagsValue';
import type { FlagOption, FlagsChange, FlagsState } from './flagsValue';

interface FlagsFieldBaseProps<T extends string> {
  readonly options: readonly FlagOption<T>[];
  readonly value: readonly NoInfer<T>[];
  readonly mixedFlags?: readonly NoInfer<T>[] | undefined;
  readonly onValueChange?: ValueChangeHandler<FlagsChange<NoInfer<T>>> | undefined;
  readonly noneLabel: string;
  readonly allLabel: string;
  readonly mixedLabel: string;
  readonly size?: ButtonSize;
  readonly disabled?: boolean | undefined;
  readonly id?: string | undefined;
  readonly className?: string | undefined;
  readonly ref?: Ref<HTMLButtonElement> | undefined;
}

interface FlagsFieldAriaLabel {
  readonly 'aria-label': string;
  readonly 'aria-labelledby'?: never;
}

interface FlagsFieldAriaLabelledBy {
  readonly 'aria-label'?: never;
  readonly 'aria-labelledby': string;
}

type FlagsFieldProps<T extends string> = FlagsFieldBaseProps<T> &
  (FlagsFieldAriaLabel | FlagsFieldAriaLabelledBy);

interface FlagsTriggerProps {
  readonly triggerProps: MenuTriggerProps;
  readonly summary: string;
  readonly size: ButtonSize;
  readonly disabled: boolean;
  readonly id: string | undefined;
  readonly className: string | undefined;
  readonly ref: Ref<HTMLButtonElement> | undefined;
  readonly 'aria-label': string | undefined;
  readonly 'aria-labelledby': string | undefined;
}

const NO_FLAGS: readonly never[] = [];
const NONE_ITEM_ID = 'flags-none';
const ALL_ITEM_ID = 'flags-all';
const SEPARATOR_ITEM_ID = 'flags-separator';
const FLAG_ITEM_PREFIX = 'flag:';

function FlagsTrigger({
  triggerProps: { ref: setReference, ...referenceProps },
  summary,
  size,
  disabled,
  id,
  className,
  ref,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: FlagsTriggerProps) {
  const triggerRef = useMergedRefs<HTMLButtonElement>(ref, setReference);
  const { ref: rovingRef, ...rovingProps } = useRovingFocusItem({
    ref: triggerRef,
    tabIndex: undefined,
    onFocus: undefined,
    disabled,
    preferred: false,
  });

  return (
    <button
      {...rovingProps}
      {...referenceProps}
      ref={rovingRef}
      id={id}
      type="button"
      disabled={disabled}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={buttonClassName({
        variant: 'default',
        size,
        shape: 'text',
        className: classNames(styles.trigger, className),
      })}
    >
      <span className={classNames(buttonLabelClassName, styles.summary)}>{summary}</span>
      <Icon icon={frameworkIcons['chevron-down']} size={BUTTON_ICON_SIZES[size]} />
    </button>
  );
}

export function FlagsField<T extends string>({
  options,
  value,
  mixedFlags = NO_FLAGS,
  onValueChange,
  noneLabel,
  allLabel,
  mixedLabel,
  size = 'md',
  disabled = false,
  id,
  className,
  ref,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: FlagsFieldProps<T>) {
  const state: FlagsState<T> = { options, value, mixedFlags };
  const summary = flagsSummary(state, { none: noneLabel, all: allLabel, mixed: mixedLabel });

  function commit(change: FlagsChange<T>): void {
    onValueChange?.(change, 'commit');
  }

  const items: readonly MenuItem[] = [
    {
      kind: 'checkbox',
      id: NONE_ITEM_ID,
      label: noneLabel,
      checked: hasNoFlags(state),
      keepOpen: true,
      onCheckedChange: () => {
        commit(setAllFlags(state, false));
      },
    },
    {
      kind: 'checkbox',
      id: ALL_ITEM_ID,
      label: allLabel,
      checked: hasAllFlags(state),
      keepOpen: true,
      onCheckedChange: () => {
        commit(setAllFlags(state, true));
      },
    },
    { kind: 'separator', id: SEPARATOR_ITEM_ID },
    ...options.map((option): MenuItem => ({
      kind: 'checkbox',
      id: `${FLAG_ITEM_PREFIX}${option.value}`,
      label: option.label,
      checked: flagCheckedState(state, option.value),
      disabled: option.disabled,
      keepOpen: true,
      onCheckedChange: (checked) => {
        commit(toggleFlag(state, option.value, checked));
      },
    })),
  ];

  return (
    <Menu
      items={items}
      trigger={(triggerProps) => (
        <FlagsTrigger
          triggerProps={triggerProps}
          summary={summary}
          size={size}
          disabled={disabled}
          id={id}
          className={className}
          ref={ref}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
        />
      )}
    />
  );
}
