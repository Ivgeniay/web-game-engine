import { Label } from '@/ui/label/Label';
import styles from './LabelTonesExample.module.css';

const PRIMARY_TEXT = 'Mesh renderer';
const SECONDARY_TEXT = 'Static batching is enabled';
const DISABLED_TEXT = 'Light probes are not available';
const SELECTABLE_TEXT = '7c1f0e2a-58d4-4b9e-a0f3-2d6e91b4c3aa';

export function LabelTonesExample() {
  return (
    <div className={styles.root}>
      <Label>{PRIMARY_TEXT}</Label>
      <Label tone="secondary">{SECONDARY_TEXT}</Label>
      <Label tone="disabled">{DISABLED_TEXT}</Label>
      <Label tone="secondary" selectable>
        {SELECTABLE_TEXT}
      </Label>
    </div>
  );
}
