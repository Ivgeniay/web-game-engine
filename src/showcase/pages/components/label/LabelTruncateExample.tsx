import { Label } from '@/ui/label/Label';
import styles from './LabelTruncateExample.module.css';

const LONG_TEXT = 'Assets/Environment/Forest/Materials/Bark_Oak_Moss_Variant_02.material';

export function LabelTruncateExample() {
  return (
    <div className={styles.root}>
      <div className={styles.narrow}>
        <Label truncate>{LONG_TEXT}</Label>
      </div>
    </div>
  );
}
