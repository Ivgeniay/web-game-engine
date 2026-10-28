import { useScene } from '@/demo/demoStores';
import { demoMessages } from '@/demo/demoMessages';
import { selectedObject } from '@/demo/scene/sceneStore';
import { useMessages } from '@/state/language/useMessages';
import { Label } from '@/ui/label/Label';
import styles from './DemoWindow.module.css';

export function InspectorWindow() {
  const t = useMessages(demoMessages);
  const selected = useScene(selectedObject);

  return (
    <div className={styles.root}>
      <Label tone={selected === null ? 'secondary' : 'primary'}>
        {selected === null ? t('nothingSelected') : t('selectedObject', { name: selected.name })}
      </Label>
    </div>
  );
}
