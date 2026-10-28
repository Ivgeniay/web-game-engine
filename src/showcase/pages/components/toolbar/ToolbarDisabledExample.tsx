import { frameworkIcons } from '@/icons/frameworkIcons';
import { Button } from '@/ui/button/Button';
import { IconButton } from '@/ui/iconButton/IconButton';
import { ToggleButton } from '@/ui/toggleButton/ToggleButton';
import { Toolbar } from '@/ui/toolbar/Toolbar';
import styles from './ToolbarDisabledExample.module.css';

const TOOLBAR_LABEL = 'Build';
const ADD_LABEL = 'Add platform';
const REFRESH_LABEL = 'Refresh the list';
const DEVELOPMENT_LABEL = 'Development build';
const BUILD_LABEL = 'Build';

export function ToolbarDisabledExample() {
  return (
    <Toolbar label={TOOLBAR_LABEL} className={styles.root}>
      <IconButton label={ADD_LABEL} icon={frameworkIcons.plus} />
      <IconButton
        label={REFRESH_LABEL}
        icon={frameworkIcons.refresh}
        disabled
        focusableWhenDisabled
      />
      <ToggleButton pressed onPressedChange={() => undefined} disabled focusableWhenDisabled>
        {DEVELOPMENT_LABEL}
      </ToggleButton>
      <Button variant="flat" disabled focusableWhenDisabled>
        {BUILD_LABEL}
      </Button>
    </Toolbar>
  );
}
