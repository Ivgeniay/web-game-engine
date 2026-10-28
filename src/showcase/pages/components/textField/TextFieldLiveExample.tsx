import { useState } from 'react';
import type { ValueChangePhase } from '@/contracts/valueChange';
import { Label } from '@/ui/label/Label';
import { TextField } from '@/ui/textField/TextField';
import styles from './TextFieldLiveExample.module.css';

const FIELD_LABEL = 'Tag';
const LOG_SIZE = 5;

interface LogEntry {
  readonly id: number;
  readonly text: string;
}

export function TextFieldLiveExample() {
  const [tag, setTag] = useState('Player');
  const [log, setLog] = useState<readonly LogEntry[]>([]);

  function handleValueChange(value: string, phase: ValueChangePhase) {
    setTag(value);
    setLog((entries) => [
      { id: (entries[0]?.id ?? 0) + 1, text: `${phase}: ${value}` },
      ...entries.slice(0, LOG_SIZE - 1),
    ]);
  }

  return (
    <div className={styles.root}>
      <TextField
        aria-label={FIELD_LABEL}
        className={styles.field}
        value={tag}
        updateMode="live"
        onValueChange={handleValueChange}
      />
      <ul className={styles.log}>
        {log.map((entry) => (
          <li key={entry.id}>
            <Label tone="secondary">{entry.text}</Label>
          </li>
        ))}
      </ul>
    </div>
  );
}
