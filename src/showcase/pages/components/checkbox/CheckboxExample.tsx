import { useState } from 'react';
import { Checkbox } from '@/ui/checkbox/Checkbox';
import styles from './CheckboxExample.module.css';

const CAST_SHADOWS_LABEL = 'Cast shadows';
const RECEIVE_SHADOWS_LABEL = 'Receive shadows';

export function CheckboxExample() {
  const [castShadows, setCastShadows] = useState(true);
  const [receiveShadows, setReceiveShadows] = useState(false);

  return (
    <div className={styles.root}>
      <Checkbox checked={castShadows} onCheckedChange={setCastShadows} label={CAST_SHADOWS_LABEL} />
      <Checkbox
        checked={receiveShadows}
        onCheckedChange={setReceiveShadows}
        label={RECEIVE_SHADOWS_LABEL}
      />
    </div>
  );
}
