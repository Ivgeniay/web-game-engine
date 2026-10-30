import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const breadcrumbsPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Breadcrumbs',
    pageDescription: 'A path through the levels with a move to any level above.',
    pathTitle: 'A path of levels',
    pathText:
      '`Breadcrumbs` shows `items` from the root to the current level, separated by arrows, like `ToolbarBreadcrumbs` in Unity. A click on a level calls `onNavigate(id)`; the last level is the current one and has `aria-current`. The owner keeps the path and gives the labels; `label` names the navigation and `moreLabel` the menu button.',
    pathText2:
      'When the levels do not fit, the middle ones collapse into a menu from the start of the path: the root and the current level stay in view. Drag the right edge of the frame in the example to make it narrower, then choose a hidden level from the menu.',
    keyboardTitle: 'Keyboard',
    keyboardText:
      'The levels and the menu button are one Tab stop with a roving focus, as in a [Toolbar](components/toolbar): Left and Right move between them, Home and End go to the ends, Enter and Space open the level.',
  },
  ru: {
    pageTitle: 'Breadcrumbs',
    pageDescription: 'Путь по уровням с переходом на любой уровень выше.',
    pathTitle: 'Путь по уровням',
    pathText:
      '`Breadcrumbs` показывает `items` от корня до текущего уровня через стрелки, как `ToolbarBreadcrumbs` в Unity. Клик по уровню вызывает `onNavigate(id)`; последний уровень — текущий, у него `aria-current`. Путь хранит владелец и даёт подписи; `label` называет навигацию, `moreLabel` — кнопку меню.',
    pathText2:
      'Когда уровни не помещаются, средние сворачиваются в меню, начиная от начала пути: корень и текущий уровень остаются видны. Потяните правый край рамки в примере, чтобы её сузить, и выберите скрытый уровень из меню.',
    keyboardTitle: 'Клавиатура',
    keyboardText:
      'Уровни и кнопка меню — одна остановка Tab с роуминговым фокусом, как в [Toolbar](components/toolbar): стрелки влево и вправо ходят между ними, Home и End — к краям, Enter и пробел открывают уровень.',
  },
});
