import { useState } from 'react';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { Button } from '@/ui/button/Button';
import { Checkbox } from '@/ui/checkbox/Checkbox';
import { IconButton } from '@/ui/iconButton/IconButton';
import { Kbd } from '@/ui/kbd/Kbd';
import { Label } from '@/ui/label/Label';
import { Separator } from '@/ui/separator/Separator';
import { ToggleButton } from '@/ui/toggleButton/ToggleButton';
import { ToggleButtonGroup } from '@/ui/toggleButtonGroup/ToggleButtonGroup';
import type { ToggleButtonGroupOption } from '@/ui/toggleButtonGroup/ToggleButtonGroup';
import { Toolbar } from '@/ui/toolbar/Toolbar';
import styles from './SceneToolbarExample.module.css';

type Tool = 'move' | 'rotate' | 'scale';

const TOOLBAR_LABEL = 'Scene';
const ADD_LABEL = 'Add object';
const REFRESH_LABEL = 'Refresh';
const TOOL_LABEL = 'Transform tool';
const HIDDEN_LABEL = 'Show hidden objects';
const SNAP_LABEL = 'Snap';
const SCENE_NAME = 'Main level with the long name';
const BUILD_LABEL = 'Build';
const BUILD_SHORTCUT = 'Ctrl+B';

const TOOL_OPTIONS: readonly ToggleButtonGroupOption<Tool>[] = [
  { value: 'move', label: 'Move' },
  { value: 'rotate', label: 'Rotate' },
  { value: 'scale', label: 'Scale' },
];

export function SceneToolbarExample() {
  const [tool, setTool] = useState<Tool>('move');
  const [showHidden, setShowHidden] = useState(false);
  const [snap, setSnap] = useState(true);

  return (
    <Toolbar label={TOOLBAR_LABEL} className={styles.root}>
      <IconButton label={ADD_LABEL} icon={frameworkIcons.plus} />
      <IconButton label={REFRESH_LABEL} icon={frameworkIcons.refresh} disabled />
      <Separator orientation="vertical" />
      <ToggleButtonGroup
        label={TOOL_LABEL}
        options={TOOL_OPTIONS}
        selection="single"
        value={tool}
        onValueChange={setTool}
        variant="flat"
      />
      <Separator orientation="vertical" />
      <ToggleButton
        pressed={showHidden}
        onPressedChange={setShowHidden}
        icon={showHidden ? frameworkIcons.eye : frameworkIcons['eye-off']}
        label={HIDDEN_LABEL}
        variant="flat"
      />
      <Checkbox checked={snap} onCheckedChange={setSnap} label={SNAP_LABEL} />
      <Separator variant="flexible" />
      <Label tone="secondary" truncate className={styles.sceneName}>
        {SCENE_NAME}
      </Label>
      <Button variant="accent" icon={frameworkIcons.settings}>
        {BUILD_LABEL}
      </Button>
      <Kbd>{BUILD_SHORTCUT}</Kbd>
    </Toolbar>
  );
}
