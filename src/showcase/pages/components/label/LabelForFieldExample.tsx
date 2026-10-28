import { useId, useState } from 'react';
import { Checkbox } from '@/ui/checkbox/Checkbox';
import { Label } from '@/ui/label/Label';
import styles from './LabelForFieldExample.module.css';

const CAPTION = 'Is trigger';

export function LabelForFieldExample() {
  const captionId = useId();
  const [isTrigger, setIsTrigger] = useState(false);

  return (
    <div className={styles.root}>
      <Label id={captionId} tone="secondary">
        {CAPTION}
      </Label>
      <Checkbox checked={isTrigger} onCheckedChange={setIsTrigger} aria-labelledby={captionId} />
    </div>
  );
}
