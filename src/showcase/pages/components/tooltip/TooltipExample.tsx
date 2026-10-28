import { Button } from '@/ui/button/Button';
import { Tooltip } from '@/ui/tooltip/Tooltip';
import styles from './TooltipExample.module.css';

const BUILD_LABEL = 'Build';
const BUILD_HINT = 'Build the project for the current platform';
const BUILD_SHORTCUT = 'Ctrl+B';
const RUN_LABEL = 'Run';
const RUN_HINT = 'Start the game in the scene view';

export function TooltipExample() {
  return (
    <div className={styles.root}>
      <Tooltip content={BUILD_HINT} shortcut={BUILD_SHORTCUT}>
        {(triggerProps) => (
          <Button {...triggerProps} variant="accent">
            {BUILD_LABEL}
          </Button>
        )}
      </Tooltip>
      <Tooltip content={RUN_HINT}>
        {(triggerProps) => <Button {...triggerProps}>{RUN_LABEL}</Button>}
      </Tooltip>
    </div>
  );
}
