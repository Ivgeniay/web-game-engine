import { splitLayout, tabsLayout } from '@/core/layout/layoutDescription';
import {
  gameWindow,
  hierarchyWindow,
  inspectorWindow,
  projectWindow,
  sceneWindow,
} from '@/demo/windows/demoWindows';

export const unityLayout = splitLayout('row', [
  splitLayout(
    'column',
    [
      splitLayout(
        'row',
        [
          tabsLayout([hierarchyWindow], { weight: 1 }),
          tabsLayout([sceneWindow, gameWindow], { weight: 3 }),
        ],
        { weight: 2 },
      ),
      tabsLayout([projectWindow], { weight: 1 }),
    ],
    { weight: 4 },
  ),
  tabsLayout([inspectorWindow], { weight: 1 }),
]);
