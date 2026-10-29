import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const dragAndDropPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Drag and drop',
    pageDescription: 'Typed data moved with the pointer from a source to a target, across windows.',
    movingDataTitle: 'Moving data between parts of the editor',
    movingDataText:
      'Drag and drop moves typed data: `DragData` has a `type`, the `ids` of what is dragged and a ready `label` for the preview next to the pointer. The mechanism is built on Pointer Events, not on HTML5 drag and drop, which stays for files from the operating system and dockview tabs. A source and a target may live in different windows: a row from Project can land in Inspector.',
    movingDataText2:
      'The entry point wraps the application in `DragAndDropLayer` inside `PopupLayer`. The layer keeps the drag session and draws the preview on the popup layer with the `--z-drag` token. Tooltips do not open while something is dragged. Without the layer the hooks throw, but only when drag and drop is enabled, so a `TreeView` without dragging works anywhere.',
    sourcesTargetsTitle: 'Sources and targets',
    sourcesTargetsText:
      '`useDragSource` returns `startDrag`: call it from `onPointerDown` with a function that builds the data. The drag starts after the pointer moves 3 pixels, so a click stays a click, and the function runs only then; it may return `null` to refuse. The click that follows a drag is swallowed. Esc cancels the drag.',
    sourcesTargetsText2:
      '`useDropTarget` takes `accepts`, the data types it takes, `onDragOver`, which returns whether the data can land at the pointer, `onDragLeave` and `onDrop`. Spread `dropTargetProps` on the target element; `isOver` is true while allowed data is over it. A target does not see data of other types at all. In the example the mesh does not fit the texture slot.',
    sourcesTargetsText3:
      'Keyboard dragging is not available yet. Highlight a target with `overlay-drop-target` and `border-drop-indicator`, as the tree does.',
  },
  ru: {
    pageTitle: 'Перенос данных',
    pageDescription:
      'Типизированные данные, которые указатель переносит от источника к цели, в том числе между окнами.',
    movingDataTitle: 'Перенос данных между частями редактора',
    movingDataText:
      'Перенос данных перемещает типизированные данные: у `DragData` есть `type`, `ids` того, что переносится, и готовая подпись `label` для превью рядом с указателем. Механизм построен на Pointer Events, а не на HTML5 Drag and Drop — он остаётся для файлов из операционной системы и вкладок dockview. Источник и цель могут жить в разных окнах: строка из Project может лечь в Inspector.',
    movingDataText2:
      'Точка входа оборачивает приложение в `DragAndDropLayer` внутри `PopupLayer`. Слой держит сеанс переноса и рисует превью в слое всплывающих элементов с токеном `--z-drag`. Пока что-то переносится, подсказки не открываются. Без слоя хуки бросают ошибку, но только когда перенос включён, поэтому `TreeView` без перетаскивания работает где угодно.',
    sourcesTargetsTitle: 'Источники и цели',
    sourcesTargetsText:
      '`useDragSource` возвращает `startDrag`: вызовите его из `onPointerDown` с функцией, которая собирает данные. Перенос начинается, когда указатель сдвинулся на 3 пикселя, поэтому клик остаётся кликом, а функция вызывается только в этот момент; она может вернуть `null` и отказаться. Клик после переноса гасится. Esc отменяет перенос.',
    sourcesTargetsText2:
      '`useDropTarget` принимает `accepts` — типы данных, которые цель берёт, — `onDragOver`, который отвечает, можно ли уронить данные под указателем, `onDragLeave` и `onDrop`. Разверните `dropTargetProps` на элементе цели; `isOver` истинно, пока над ней подходящие данные. Данных других типов цель не видит вовсе. В примере меш не подходит к слоту текстуры.',
    sourcesTargetsText3:
      'Перенос с клавиатуры пока недоступен. Подсвечивайте цель через `overlay-drop-target` и `border-drop-indicator`, как это делает дерево.',
  },
});
