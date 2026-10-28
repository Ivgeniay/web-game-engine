import {
  autoUpdate,
  FloatingFocusManager,
  FloatingList,
  FloatingNode,
  FloatingTree,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead,
} from '@floating-ui/react';
import type { ReferenceType } from '@floating-ui/react';
import { useCallback, useRef, useState } from 'react';
import type { Ref } from 'react';
import { frameworkIcons } from '@/icons/frameworkIcons';
import {
  BUTTON_ICON_SIZES,
  buttonClassName,
  buttonLabelClassName,
} from '@/ui/button/buttonClassName';
import type { ButtonSize } from '@/ui/button/buttonClassName';
import { classNames } from '@/ui/classNames';
import { Icon } from '@/ui/icon/Icon';
import { POPUP_BLOCKS_TOOLTIPS_PROPS } from '@/ui/popup/popupLayerAttributes';
import { usePopupMiddleware } from '@/ui/popup/popupPosition';
import { PopupPortal } from '@/ui/popup/PopupPortal';
import popupSurface from '@/ui/popup/popupSurface.module.css';
import { useCloseWhenAnchorHides } from '@/ui/popup/useCloseWhenAnchorHides';
import { useRovingFocusItem } from '@/ui/rovingFocus/useRovingFocusItem';
import type { ToggleButtonVariant } from '@/ui/toggleButton/ToggleButton';
import { useMergedRefs } from '@/ui/useMergedRefs';
import styles from './Select.module.css';
import { findSelectedOption, selectedListIndex } from './selectOptions';
import type { SelectAction, SelectEntry } from './selectOptions';
import { SelectRow } from './SelectRow';

interface SelectBaseProps<T extends string> {
  readonly options: readonly SelectEntry<T>[];
  readonly value: NoInfer<T> | null;
  readonly onValueChange: (value: NoInfer<T>) => void;
  readonly placeholder?: string | undefined;
  readonly action?: SelectAction | undefined;
  readonly variant?: ToggleButtonVariant;
  readonly size?: ButtonSize;
  readonly disabled?: boolean | undefined;
  readonly id?: string | undefined;
  readonly className?: string | undefined;
  readonly ref?: Ref<HTMLButtonElement> | undefined;
}

interface SelectAriaLabel {
  readonly 'aria-label': string;
  readonly 'aria-labelledby'?: never;
}

interface SelectAriaLabelledBy {
  readonly 'aria-label'?: never;
  readonly 'aria-labelledby': string;
}

type SelectProps<T extends string> = SelectBaseProps<T> & (SelectAriaLabel | SelectAriaLabelledBy);

const NO_INITIAL_FOCUS = -1;

function SelectField<T extends string>({
  options,
  value,
  onValueChange,
  placeholder,
  action,
  variant = 'default',
  size = 'md',
  disabled = false,
  id,
  className,
  ref,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [typing, setTyping] = useState(false);
  const elementsRef = useRef<(HTMLElement | null)[]>([]);
  const labelsRef = useRef<(string | null)[]>([]);
  const nodeId = useFloatingNodeId();
  const middleware = usePopupMiddleware({ fitHeight: true, matchAnchorWidth: true });

  const { refs, floatingStyles, context, middlewareData } = useFloating({
    nodeId,
    open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
    middleware,
    whileElementsMounted: autoUpdate,
  });

  useCloseWhenAnchorHides(open, middlewareData.hide?.referenceHidden, setOpen);

  const selectedIndex = selectedListIndex(options, value);

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    useClick(context, { enabled: !disabled }),
    useRole(context, { role: 'select' }),
    useDismiss(context),
    useListNavigation(context, {
      listRef: elementsRef,
      activeIndex,
      selectedIndex,
      onNavigate: setActiveIndex,
      loop: true,
      openOnArrowKeyDown: false,
      focusItemOnOpen: true,
    }),
    useTypeahead(context, {
      listRef: labelsRef,
      activeIndex,
      selectedIndex,
      onMatch: open ? setActiveIndex : undefined,
      onTypingChange: setTyping,
    }),
  ]);

  const setReference = useCallback(
    (node: ReferenceType | null) => {
      refs.setReference(node);
    },
    [refs],
  );
  const setFloating = useCallback(
    (node: HTMLElement | null) => {
      refs.setFloating(node);
    },
    [refs],
  );

  const triggerRef = useMergedRefs<HTMLButtonElement>(ref, setReference);
  const { ref: rovingRef, ...rovingProps } = useRovingFocusItem({
    ref: triggerRef,
    tabIndex: undefined,
    onFocus: undefined,
    disabled,
    preferred: false,
  });

  const selected = findSelectedOption(options, value);
  const labelling = { 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy };

  function choose(next: T) {
    onValueChange(next);
    setOpen(false);
  }

  function chooseAction(selectAction: SelectAction) {
    selectAction.onSelect();
    setOpen(false);
  }

  return (
    <FloatingNode id={nodeId}>
      <button
        {...getReferenceProps({
          ...rovingProps,
          onKeyDown(event) {
            if (event.altKey && event.key === 'ArrowDown') {
              event.preventDefault();
              setOpen(true);
            }
          },
        })}
        {...labelling}
        ref={rovingRef}
        id={id}
        type="button"
        disabled={disabled}
        className={buttonClassName({
          variant,
          size,
          shape: 'text',
          className: classNames(styles.trigger, className),
        })}
      >
        {selected?.icon !== undefined && (
          <Icon icon={selected.icon} size={BUTTON_ICON_SIZES[size]} />
        )}
        <span
          className={classNames(
            buttonLabelClassName,
            styles.value,
            selected === undefined && styles.placeholder,
          )}
        >
          {selected?.label ?? placeholder}
        </span>
        <Icon icon={frameworkIcons['chevron-down']} size={BUTTON_ICON_SIZES[size]} />
      </button>
      <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
        {open && (
          <PopupPortal>
            <FloatingFocusManager
              context={context}
              modal={false}
              initialFocus={NO_INITIAL_FOCUS}
              returnFocus
            >
              <div
                {...POPUP_BLOCKS_TOOLTIPS_PROPS}
                {...getFloatingProps()}
                {...labelling}
                ref={setFloating}
                className={classNames(popupSurface.surface, styles.list)}
                style={floatingStyles}
              >
                {options.map((entry) =>
                  entry.kind === 'separator' ? (
                    <div key={entry.id} className={styles.separator} role="presentation" />
                  ) : (
                    <SelectRow
                      key={entry.value}
                      label={entry.label}
                      icon={entry.icon}
                      selected={entry.value === value}
                      disabled={entry.disabled === true}
                      activeIndex={activeIndex}
                      typing={typing}
                      getItemProps={getItemProps}
                      onChoose={() => {
                        choose(entry.value);
                      }}
                    />
                  ),
                )}
                {action !== undefined && (
                  <>
                    <div className={styles.separator} role="presentation" />
                    <SelectRow
                      label={action.label}
                      icon={action.icon}
                      selected={false}
                      disabled={false}
                      activeIndex={activeIndex}
                      typing={typing}
                      getItemProps={getItemProps}
                      onChoose={() => {
                        chooseAction(action);
                      }}
                    />
                  </>
                )}
              </div>
            </FloatingFocusManager>
          </PopupPortal>
        )}
      </FloatingList>
    </FloatingNode>
  );
}

export function Select<T extends string>(props: SelectProps<T>) {
  const parentId = useFloatingParentNodeId();

  if (parentId !== null) {
    return <SelectField {...props} />;
  }

  return (
    <FloatingTree>
      <SelectField {...props} />
    </FloatingTree>
  );
}
