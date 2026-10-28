import { Label } from '@/ui/label/Label';
import { Separator } from '@/ui/separator/Separator';
import styles from './SeparatorExample.module.css';

const TRANSFORM = 'Transform';
const RENDERING = 'Rendering';
const LEFT = 'Left group';
const RIGHT = 'Right group';
const END = 'Pushed to the end';

export function SeparatorExample() {
  return (
    <div className={styles.root}>
      <div className={styles.column}>
        <Label>{TRANSFORM}</Label>
        <Separator />
        <Label>{RENDERING}</Label>
      </div>
      <div className={styles.row}>
        <Label>{LEFT}</Label>
        <Separator orientation="vertical" />
        <Label>{RIGHT}</Label>
        <Separator variant="flexible" />
        <Label>{END}</Label>
      </div>
    </div>
  );
}
