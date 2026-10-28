import { demoMessages } from '@/demo/demoMessages';
import { useMessages } from '@/state/language/useMessages';
import { Label } from '@/ui/label/Label';
import styles from './DemoWindow.module.css';

export function ProjectWindow() {
  const t = useMessages(demoMessages);

  return (
    <div className={styles.root}>
      <Label tone="secondary">{t('projectStub')}</Label>
    </div>
  );
}
