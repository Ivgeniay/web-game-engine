import { Button } from '@/ui/button/Button';
import styles from './ButtonVariantsExample.module.css';

const CANCEL_LABEL = 'Cancel';
const BUILD_LABEL = 'Build';
const RELOAD_LABEL = 'Reload';

export function ButtonVariantsExample() {
  return (
    <div className={styles.root}>
      <Button>{CANCEL_LABEL}</Button>
      <Button variant="accent">{BUILD_LABEL}</Button>
      <Button variant="flat">{RELOAD_LABEL}</Button>
    </div>
  );
}
