import { useId, useState } from 'react';
import { Label } from '@/ui/label/Label';
import { TextArea } from '@/ui/textArea/TextArea';
import styles from './TextAreaExample.module.css';

const CAPTION = 'Note';
const COMMITTED_CAPTION = 'Committed lines:';
const LINE_BREAK = '\n';
const MAX_ROWS = 5;

export function TextAreaExample() {
  const fieldId = useId();
  const [note, setNote] = useState('Spawn point for the second wave.\nKeep clear of the bridge.');

  return (
    <div className={styles.root}>
      <Label htmlFor={fieldId} tone="secondary">
        {CAPTION}
      </Label>
      <TextArea
        id={fieldId}
        className={styles.field}
        value={note}
        maxRows={MAX_ROWS}
        onValueChange={setNote}
      />
      <Label tone="secondary">
        {`${COMMITTED_CAPTION} ${String(note.split(LINE_BREAK).length)}`}
      </Label>
    </div>
  );
}
