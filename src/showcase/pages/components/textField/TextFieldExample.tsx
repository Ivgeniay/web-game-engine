import { useId, useState } from 'react';
import { Label } from '@/ui/label/Label';
import { TextField } from '@/ui/textField/TextField';
import styles from './TextFieldExample.module.css';

const CAPTION = 'Name';
const COMMITTED_CAPTION = 'Committed:';

export function TextFieldExample() {
  const fieldId = useId();
  const [name, setName] = useState('Main Camera');

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <Label htmlFor={fieldId} tone="secondary">
          {CAPTION}
        </Label>
        <TextField id={fieldId} className={styles.field} value={name} onValueChange={setName} />
      </div>
      <Label tone="secondary">{`${COMMITTED_CAPTION} ${name}`}</Label>
    </div>
  );
}
