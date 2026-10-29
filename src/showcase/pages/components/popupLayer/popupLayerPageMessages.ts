import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const popupLayerPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Popup layer',
    pageDescription:
      'The shared layer for tooltips, menus, lists, popovers and dialogs: z-index and position.',
    oneLayerTitle: 'One layer for every popup',
    oneLayerText:
      'Tooltips, menus, lists, popovers and dialogs are rendered into one layer at the end of the document, the `#popup-layer` element, not next to the control that opens them. A panel with `overflow: hidden` or its own stacking order cannot clip or cover them. Theme tokens are declared on the root element, so popups follow the theme like the rest of the editor.',
    oneLayerText2:
      'The button in the example sits at the edge of a panel that clips its content. Hover it: the tooltip leaves the panel and moves away from the edge of the screen.',
    connectingLayerTitle: 'Connecting the layer',
    connectingLayerText:
      'Wrap the app in `PopupLayer` from `@/ui/popup/PopupLayer` once, in the entry point, inside `StoresProvider`. The editor and the showcase already do this. The layer groups tooltips, so the hints of neighbouring controls appear without the delay. Without it every popup still works, only that grouping is lost.',
    stackingPositionTitle: 'Stacking and position',
    stackingPositionText:
      'Every kind of popup takes its z-index from a token: `--z-modal` for dialogs, `--z-dropdown` for menus, lists and popovers, `--z-tooltip` for tooltips. Since all popups share one layer, the token order alone decides what is on top, so a list or a tooltip opened inside a dialog appears above it.',
    stackingPositionText2:
      'A popup keeps a gap of `--space-4` from its anchor and of `--space-8` from the edges of the screen. Near an edge it flips to the other side of the anchor and shifts along it; lists and popovers shrink their height to fit. When the anchor is scrolled out of view, the popup hides.',
  },
  ru: {
    pageTitle: 'Слой всплывающих элементов',
    pageDescription:
      'Общий слой для подсказок, меню, списков, всплывающих панелей и диалогов: z-index и позиция.',
    oneLayerTitle: 'Один слой для всех всплывающих элементов',
    oneLayerText:
      'Подсказки, меню, списки, всплывающие панели и диалоги рисуются в один слой в конце документа — элемент `#popup-layer`, — а не рядом с элементом, который их открывает. Панель с `overflow: hidden` или своим порядком наложения не может их обрезать или перекрыть. Токены темы объявлены на корневом элементе, поэтому всплывающие элементы следуют теме, как и весь редактор.',
    oneLayerText2:
      'Кнопка в примере стоит у края панели, которая обрезает своё содержимое. Наведите на неё указатель: подсказка выходит за пределы панели и отодвигается от края экрана.',
    connectingLayerTitle: 'Подключение слоя',
    connectingLayerText:
      'Оберните приложение в `PopupLayer` из `@/ui/popup/PopupLayer` один раз, в точке входа, внутри `StoresProvider`. Редактор и витрина уже это делают. Слой группирует подсказки, поэтому подсказки соседних элементов появляются без задержки. Без него все всплывающие элементы работают, теряется только эта группировка.',
    stackingPositionTitle: 'Порядок наложения и позиция',
    stackingPositionText:
      'Каждый вид всплывающего элемента берёт z-index из токена: `--z-modal` у диалогов, `--z-dropdown` у меню, списков и всплывающих панелей, `--z-tooltip` у подсказок. Все всплывающие элементы делят один слой, поэтому кто сверху, решает только порядок токенов, и список или подсказка, открытые внутри диалога, оказываются поверх него.',
    stackingPositionText2:
      'Всплывающий элемент держит зазор `--space-4` от якоря и `--space-8` от краёв экрана. У края он переворачивается на другую сторону якоря и сдвигается вдоль него; списки и всплывающие панели уменьшают высоту, чтобы поместиться. Когда якорь прокручен из вида, всплывающий элемент прячется.',
  },
});
