import { frameworkIcons } from '@/icons/frameworkIcons';
import { Label } from '@/ui/label/Label';
import { ListView } from '@/ui/listView/ListView';
import { useListViewState } from '@/ui/listView/useListViewState';
import styles from './ListViewExample.module.css';

const LIST_LABEL = 'Scenes';

const SCENES: Readonly<Record<string, string>> = {
  'scene-menu': 'Main Menu',
  'scene-forest': 'Forest',
  'scene-cave': 'Cave',
  'scene-castle': 'Castle',
  'scene-boss': 'Boss Arena',
  'scene-credits': 'Credits',
};

const SCENE_IDS = Object.keys(SCENES);

function sceneName(id: string): string {
  return SCENES[id] ?? id;
}

function sceneIcon() {
  return frameworkIcons.file;
}

export function ListViewExample() {
  const state = useListViewState({ selectedIds: ['scene-forest'] });
  const selectedNames = state.selectedIds.map(sceneName).join(', ');

  return (
    <div className={styles.root}>
      <ListView
        aria-label={LIST_LABEL}
        className={styles.list}
        itemIds={SCENE_IDS}
        getLabel={sceneName}
        getIcon={sceneIcon}
        selectionMode="multiple"
        {...state}
      />
      <Label tone="secondary">{`Selected: ${selectedNames === '' ? 'none' : selectedNames}`}</Label>
    </div>
  );
}
