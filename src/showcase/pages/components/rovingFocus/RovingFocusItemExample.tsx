import { useState } from 'react';
import { RovingFocusContext } from '@/ui/rovingFocus/rovingFocusContext';
import { useRovingFocusGroup } from '@/ui/rovingFocus/useRovingFocusGroup';
import { useRovingFocusItem } from '@/ui/rovingFocus/useRovingFocusItem';
import styles from './RovingFocusItemExample.module.css';

const LIST_LABEL = 'Inspector mode';
const MODES = ['Normal', 'Debug', 'Locked'] as const;

type Mode = (typeof MODES)[number];

interface ModeTabProps {
  readonly mode: Mode;
  readonly selected: boolean;
  readonly onSelect: (mode: Mode) => void;
}

function ModeTab({ mode, selected, onSelect }: ModeTabProps) {
  const rovingProps = useRovingFocusItem<HTMLButtonElement>({
    ref: undefined,
    tabIndex: undefined,
    onFocus: undefined,
    disabled: false,
    preferred: selected,
  });

  return (
    <button
      {...rovingProps}
      className={styles.tab}
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={() => {
        onSelect(mode);
      }}
    >
      {mode}
    </button>
  );
}

export function RovingFocusItemExample() {
  const [selected, setSelected] = useState<Mode>('Normal');
  const { registry, onKeyDown } = useRovingFocusGroup({ orientation: 'horizontal' });

  return (
    <RovingFocusContext value={registry}>
      <div className={styles.root} role="tablist" aria-label={LIST_LABEL} onKeyDown={onKeyDown}>
        {MODES.map((mode) => (
          <ModeTab key={mode} mode={mode} selected={mode === selected} onSelect={setSelected} />
        ))}
      </div>
    </RovingFocusContext>
  );
}
