import { useListItem } from '@floating-ui/react';
import type { HTMLProps } from 'react';
import { frameworkIcons } from '@/icons/frameworkIcons';
import type { IconSource } from '@/icons/icon';
import { Icon } from '@/ui/icon/Icon';
import styles from './Select.module.css';

interface SelectItemUserProps extends HTMLProps<HTMLElement> {
  readonly active?: boolean;
  readonly selected?: boolean;
}

interface SelectRowProps {
  readonly label: string;
  readonly icon: IconSource | undefined;
  readonly selected: boolean;
  readonly disabled: boolean;
  readonly activeIndex: number | null;
  readonly typing: boolean;
  readonly getItemProps: (userProps?: SelectItemUserProps) => Record<string, unknown>;
  readonly onChoose: () => void;
}

const ACTIVE_TAB_INDEX = 0;
const INACTIVE_TAB_INDEX = -1;

export function SelectRow({
  label,
  icon,
  selected,
  disabled,
  activeIndex,
  typing,
  getItemProps,
  onChoose,
}: SelectRowProps) {
  const { ref, index } = useListItem({ label: disabled ? null : label });
  const active = index === activeIndex;

  function choose() {
    if (!disabled) {
      onChoose();
    }
  }

  return (
    <div
      ref={ref}
      aria-disabled={disabled ? true : undefined}
      tabIndex={active ? ACTIVE_TAB_INDEX : INACTIVE_TAB_INDEX}
      className={styles.option}
      data-active={active ? '' : undefined}
      {...getItemProps({
        active,
        selected,
        onClick: choose,
        onKeyDown(event) {
          if (event.key === 'Enter' || (event.key === ' ' && !typing)) {
            event.preventDefault();
            choose();
          }
        },
      })}
    >
      <span className={styles.mark}>{selected && <Icon icon={frameworkIcons.check} />}</span>
      {icon !== undefined && <Icon icon={icon} />}
      <span className={styles.optionLabel}>{label}</span>
    </div>
  );
}
