import { useEffect, useRef } from 'react';
import type { KeyboardEvent, SyntheticEvent } from 'react';
import type { ValueChangePhase } from '@/contracts/valueChange';
import type { IconSource } from '@/icons/icon';
import { Icon } from '@/ui/icon/Icon';
import { TextField } from '@/ui/textField/TextField';
import styles from './TreeRenameField.module.css';

export interface RenameOutcome {
  readonly name: string | null;
  readonly returnFocus: boolean;
}

interface TreeRenameFieldProps {
  readonly name: string;
  readonly label: string;
  readonly icon?: IconSource | undefined;
  readonly validate?: ((name: string) => string | undefined) | undefined;
  readonly onFinish: (outcome: RenameOutcome) => void;
}

function stopRowEvent(event: SyntheticEvent): void {
  event.stopPropagation();
}

export function TreeRenameField({ name, label, icon, validate, onFinish }: TreeRenameFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const committedName = useRef<string | null>(null);
  const returnFocus = useRef(false);
  const finished = useRef(false);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  function handleValueChange(value: string, phase: ValueChangePhase): void {
    committedName.current = phase === 'commit' ? value : null;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      returnFocus.current = true;
      event.currentTarget.blur();
    } else if (event.key === 'Escape') {
      event.stopPropagation();
      returnFocus.current = true;
    }
  }

  function finish(): void {
    if (finished.current) {
      return;
    }

    finished.current = true;
    onFinish({ name: committedName.current, returnFocus: returnFocus.current });
  }

  return (
    <span
      className={styles.root}
      onBlur={finish}
      onClick={stopRowEvent}
      onDoubleClick={stopRowEvent}
    >
      {icon !== undefined && (
        <span className={styles.icon}>
          <Icon icon={icon} />
        </span>
      )}
      <TextField
        ref={inputRef}
        className={styles.field}
        aria-label={label}
        value={name}
        validate={validate}
        onValueChange={handleValueChange}
        onKeyDown={handleKeyDown}
      />
    </span>
  );
}
