import { usePlayMode } from '@/demo/demoStores';
import { demoMessages } from '@/demo/demoMessages';
import { useMessages } from '@/state/language/useMessages';
import { Label } from '@/ui/label/Label';
import styles from './DemoWindow.module.css';

export function GameWindow() {
  const t = useMessages(demoMessages);
  const mode = usePlayMode((state) => state.mode);
  const frame = usePlayMode((state) => state.frame);

  return (
    <div className={styles.root}>
      <Label tone="secondary">{t('gameStub')}</Label>
      {mode !== 'edit' && <Label>{t('frame', { frame: String(frame) })}</Label>}
    </div>
  );
}
