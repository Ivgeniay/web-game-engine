import { Button } from '@/ui/button/Button';
import styles from './ButtonSizesExample.module.css';

const SMALL_LABEL = 'Small';
const MEDIUM_LABEL = 'Medium';
const LARGE_LABEL = 'Large';

export function ButtonSizesExample() {
  return (
    <div className={styles.root}>
      <Button size="sm">{SMALL_LABEL}</Button>
      <Button size="md">{MEDIUM_LABEL}</Button>
      <Button size="lg">{LARGE_LABEL}</Button>
    </div>
  );
}
