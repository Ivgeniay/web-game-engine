import { Checkbox } from '@/ui/checkbox/Checkbox';
import styles from './CheckboxDisabledExample.module.css';

const CHECKED_LABEL = 'Static';
const MIXED_LABEL = 'Contribute to global illumination';
const UNCHECKED_LABEL = 'Occluder';

function ignoreChange() {
  return undefined;
}

export function CheckboxDisabledExample() {
  return (
    <div className={styles.root}>
      <Checkbox checked onCheckedChange={ignoreChange} label={CHECKED_LABEL} disabled />
      <Checkbox checked="mixed" onCheckedChange={ignoreChange} label={MIXED_LABEL} disabled />
      <Checkbox checked={false} onCheckedChange={ignoreChange} label={UNCHECKED_LABEL} disabled />
    </div>
  );
}
