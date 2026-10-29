import { useState } from 'react';
import type { MessageRef } from '@/core/i18n/translate';
import { messageRef } from '@/core/i18n/translate';
import { combineUnsubscribes } from '@/core/unsubscribe';
import { useDemoStores, useScene } from '@/demo/demoStores';
import { demoMessages } from '@/demo/demoMessages';
import { selectedObjects } from '@/demo/scene/sceneStore';
import { useMessages } from '@/state/language/useMessages';
import { useTranslate } from '@/state/language/useTranslate';
import { useRegistration } from '@/state/registries/useRegistration';
import { Label } from '@/ui/label/Label';
import { frameSelectedCommand, toggleGridCommand } from './demoWindowCommands';
import styles from './DemoWindow.module.css';

export function SceneWindow() {
  const { scene } = useDemoStores();
  const t = useMessages(demoMessages);
  const translate = useTranslate();
  const gridVisible = useScene((state) => state.gridVisible);
  const [framed, setFramed] = useState<MessageRef | null>(null);

  useRegistration(
    ({ commands }) =>
      combineUnsubscribes(
        commands.handle(frameSelectedCommand, {
          run: () => {
            const [selected] = selectedObjects(scene.getState());

            if (selected !== undefined) {
              setFramed(messageRef(demoMessages, 'framed', { name: selected.name }));
            }
          },
          isEnabled: () => scene.getState().selectedIds.length > 0,
        }),
        commands.handle(toggleGridCommand, {
          run: () => {
            scene.getState().toggleGrid();
          },
          isChecked: () => scene.getState().gridVisible,
        }),
      ),
    [scene],
  );

  return (
    <div className={styles.root}>
      <Label tone="secondary">{t('sceneStub')}</Label>
      <Label tone="secondary">{gridVisible ? t('gridOn') : t('gridOff')}</Label>
      {framed !== null && <Label>{translate(framed)}</Label>}
    </div>
  );
}
