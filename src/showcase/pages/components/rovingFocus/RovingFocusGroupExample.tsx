import { Button } from '@/ui/button/Button';
import { RovingFocusContext } from '@/ui/rovingFocus/rovingFocusContext';
import { useRovingFocusGroup } from '@/ui/rovingFocus/useRovingFocusGroup';
import styles from './RovingFocusGroupExample.module.css';

const GROUP_LABEL = 'Scene actions';
const ACTIONS = ['Frame selected', 'Align with view', 'Reset camera'] as const;

export function RovingFocusGroupExample() {
  const { registry, onKeyDown } = useRovingFocusGroup({ orientation: 'vertical' });

  return (
    <RovingFocusContext value={registry}>
      <div className={styles.root} role="group" aria-label={GROUP_LABEL} onKeyDown={onKeyDown}>
        {ACTIONS.map((action) => (
          <Button key={action} variant="flat">
            {action}
          </Button>
        ))}
      </div>
    </RovingFocusContext>
  );
}
