import { usePlayMode } from '@/demo/demoStores';
import { demoMessages } from '@/demo/demoMessages';
import { useMessages } from '@/state/language/useMessages';
import { Label } from '@/ui/label/Label';
import styles from './PlayModeStatus.module.css';

export function PlayModeStatus() {
  const t = useMessages(demoMessages);
  const mode = usePlayMode((state) => state.mode);
  const frame = usePlayMode((state) => state.frame);
  const modeLabel = { edit: t('editMode'), play: t('playMode'), paused: t('paused') }[mode];

  return (
    <span className={styles.root}>
      <Label tone="secondary">{modeLabel}</Label>
      {mode !== 'edit' && <Label tone="secondary">{t('frame', { frame: String(frame) })}</Label>}
    </span>
  );
}
