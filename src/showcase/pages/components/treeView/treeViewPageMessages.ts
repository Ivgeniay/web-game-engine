import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const treeViewPageMessages = defineDocMessages({
  en: {
    pageTitle: 'TreeView',
    pageDescription: 'A fast tree over flat data with expanding, selection and keyboard moves.',
    treeOverTitle: 'A tree over your data',
    treeOverText:
      '`TreeView` does not copy the tree. It reads it through a `TreeModel`: `rootIds`, `getChildren`, `hasChildren`, `getLabel` and the optional `getIcon`. The tree asks only for the children of expanded nodes. When the data changes, pass a new model object, for example one built with `useMemo` from a store snapshot.',
    treeOverText2:
      'The tree is a `ListView` over the visible nodes, so the selection, the focused row, the keyboard and the mouse work as described on the [ListView](components/list-view) page. On top of that, the expanded nodes are controlled: `expandedIds` with `onExpandedIdsChange`. `useTreeViewState` holds all three parts when the owner does not need them. A selected node stays selected while its parent is collapsed.',
    tenThousandTitle: 'Ten thousand rows',
    tenThousandText:
      'A hundred groups of a hundred objects, all expanded. Like the list, the tree draws only the rows in view, and expanding or collapsing a group rebuilds the list of visible nodes without touching the hidden ones.',
    expandedNodesTitle: 'Expanded nodes and icons',
    expandedNodesText:
      'The owner may keep `expandedIds` itself, for example to save them with the window or to expand everything from a command. `getIcon` receives the expanded state, so a folder can show an open icon. `renderRow` replaces the icon and the label like in `ListView` and also receives `depth`, `hasChildren`, `expanded` and `match`, the range of the search match to pass to `ListRowContent` as `highlight`. The indent and the arrow stay with the tree. A double click starts renaming only on an element with the `data-list-row-label` attribute, which `ListRowContent` puts on its label.',
    renamingTitle: 'Renaming',
    renamingText:
      'With `onRename`, F2 (Enter on macOS) or a double click on the label turns the row into a field. The field follows the value protocol of the other fields: Enter and leaving the field commit, Esc cancels and does not close a dialog around the tree. `onRename` is called only with a changed, valid name; the owner changes the data and passes a new model, the tree does not keep the name.',
    renamingText2:
      '`validateName` returns the message for an invalid name, and the field shows it while typing; an invalid name is not committed. `renameLabel` names the field for screen readers. The row being renamed is controlled too: `renamingId` with `onRenamingIdChange`, so a context menu command can start renaming. After Enter or Esc the focus returns to the tree.',
    searchTitle: 'Search',
    searchText:
      '`filter` shows the nodes whose label contains the text, ignoring the case, together with their ancestors. The search looks into collapsed nodes too. The ancestors are expanded, and the match in the label is underlined. Children of a match that do not match are hidden.',
    searchText2:
      'While the filter is on, expanding and collapsing change only the view of the results, not `expandedIds`. When the filter is cleared, the tree expands the ancestors of the selected node through `onExpandedIdsChange`, focuses it and scrolls to it, so the found object stays in view.',
    searchText3:
      "Put a `SearchField` above the tree and pass the tree's `ref` as `resultsRef`: Down in the field moves the focus to the tree.",
    draggingRowsTitle: 'Dragging rows',
    draggingRowsText:
      '`dragType` lets the rows be dragged with the drag and drop mechanism, so the tree needs `DragAndDropLayer` around it. Dragging a selected row takes the whole selection; dragging another row selects it first. The tree passes the ids in the tree order and leaves out the descendants of other dragged nodes.',
    draggingRowsText2:
      '`onDropData` makes the tree a drop target. It receives the data and a `TreeDropTarget`: a node with the position `before`, `after` or `inside`, or `root` for the empty space below the rows. The upper and lower quarters of a row mean before and after, the middle means inside; below an expanded node the place is before its first child. The tree does not move anything: the owner changes the data and passes a new model.',
    draggingRowsText3:
      'A node never lands inside itself or its descendants, the tree checks this before asking `canDropData`. `dropTypes` lists other data types the tree takes, such as assets from another window. Near the top and bottom edges the tree scrolls, and holding the pointer over a collapsed node expands it. `getDragLabel` replaces the preview text, which is the first name and the number of other nodes.',
    keyboardMouseTitle: 'Keyboard and mouse',
    keyboardMouseItem:
      'All keys of ListView: arrows, Home, End, pages, Shift, Ctrl (⌘), Ctrl+A, letters.',
    keyboardMouseItem2:
      'Right expands a collapsed node, and on an expanded node moves to its first child. Left collapses an expanded node, and on other nodes moves to the parent.',
    keyboardMouseItem3:
      'Alt+Right and Alt+Left expand and collapse the node with its whole subtree.',
    keyboardMouseItem4: 'F2 (Enter on macOS) renames the focused row when the tree has `onRename`.',
    keyboardMouseItem5:
      'Esc while dragging cancels the drag. Dragging from the keyboard is not available yet.',
    keyboardMouseItem6:
      'A click on the arrow expands or collapses the node without selecting it. Alt+click does the same for the whole subtree.',
    keyboardMouseItem7:
      'When collapsing hides the focused row, the focus moves to the collapsed node, and the selection does not change.',
    keyboardMouseText:
      'Each row has `aria-level`, `aria-posinset`, `aria-setsize` and, for nodes with children, `aria-expanded`, so screen readers announce the structure although the rows are drawn as a flat list. The indent of a level is the `--size-tree-indent` token.',
  },
  ru: {
    pageTitle: 'TreeView',
    pageDescription:
      'Быстрое дерево над плоскими данными: раскрытие, выделение и управление с клавиатуры.',
    treeOverTitle: 'Дерево над вашими данными',
    treeOverText:
      '`TreeView` не копирует дерево. Он читает его через `TreeModel`: `rootIds`, `getChildren`, `hasChildren`, `getLabel` и необязательный `getIcon`. Дерево запрашивает детей только у развёрнутых узлов. Когда данные меняются, передайте новый объект модели, например собранный через `useMemo` из снимка стора.',
    treeOverText2:
      'Дерево — это `ListView` над видимыми узлами, поэтому выделение, строка с фокусом, клавиатура и мышь работают так, как описано на странице [ListView](components/list-view). Сверх того развёрнутые узлы управляемые: `expandedIds` с `onExpandedIdsChange`. `useTreeViewState` держит все три части, если владельцу они не нужны. Выделенный узел остаётся выделенным, пока его родитель свёрнут.',
    tenThousandTitle: 'Десять тысяч строк',
    tenThousandText:
      'Сто групп по сто объектов, все развёрнуты. Как и список, дерево рисует только видимые строки, а разворачивание или сворачивание группы перестраивает список видимых узлов, не трогая скрытые.',
    expandedNodesTitle: 'Развёрнутые узлы и иконки',
    expandedNodesText:
      'Владелец может сам хранить `expandedIds`, например чтобы сохранять их вместе с окном или развернуть всё командой. `getIcon` получает признак развёрнутости, поэтому папка может показать открытую иконку. `renderRow` заменяет иконку и подпись, как в `ListView`, и вдобавок получает `depth`, `hasChildren`, `expanded` и `match` — диапазон совпадения с поиском, который передаётся в `ListRowContent` как `highlight`. Отступ и стрелка остаются за деревом. Двойной клик начинает переименование только на элементе с атрибутом `data-list-row-label`, который `ListRowContent` ставит на свою подпись.',
    renamingTitle: 'Переименование',
    renamingText:
      'С `onRename` клавиша F2 (Enter на macOS) или двойной клик по подписи превращают строку в поле. Поле следует протоколу значения, как остальные поля: Enter и уход из поля фиксируют, Esc отменяет и не закрывает диалог вокруг дерева. `onRename` вызывается только с изменённым корректным именем; данные меняет владелец и передаёт новую модель, дерево имя не хранит.',
    renamingText2:
      '`validateName` возвращает сообщение для некорректного имени, и поле показывает его во время ввода; некорректное имя не фиксируется. `renameLabel` называет поле для скринридеров. Переименуемая строка тоже управляемая: `renamingId` с `onRenamingIdChange`, поэтому переименование может начать команда контекстного меню. После Enter или Esc фокус возвращается в дерево.',
    searchTitle: 'Поиск',
    searchText:
      '`filter` показывает узлы, подпись которых содержит текст без учёта регистра, вместе с их предками. Поиск заглядывает и в свёрнутые узлы. Предки разворачиваются, а совпадение в подписи подчёркивается. Дети совпавшего узла, которые сами не совпали, скрыты.',
    searchText2:
      'Пока фильтр включён, разворачивание и сворачивание меняют только вид результатов, а не `expandedIds`. Когда фильтр очищают, дерево через `onExpandedIdsChange` разворачивает предков выделенного узла, ставит на него фокус и прокручивает к нему, чтобы найденный объект остался на виду.',
    searchText3:
      'Поставьте над деревом `SearchField` и передайте `ref` дерева как `resultsRef`: стрелка вниз в поле переведёт фокус в дерево.',
    draggingRowsTitle: 'Перетаскивание строк',
    draggingRowsText:
      '`dragType` позволяет перетаскивать строки механизмом переноса данных, поэтому вокруг дерева нужен `DragAndDropLayer`. Перетаскивание выделенной строки берёт всё выделение; перетаскивание другой строки сначала выделяет её. Дерево передаёт id в порядке дерева и пропускает потомков других переносимых узлов.',
    draggingRowsText2:
      '`onDropData` делает дерево целью переноса. Он получает данные и `TreeDropTarget`: узел с позицией `before`, `after` или `inside` либо `root` для пустого места под строками. Верхняя и нижняя четверти строки означают «перед» и «после», середина — «внутрь»; под развёрнутым узлом место — перед его первым ребёнком. Дерево ничего не перемещает: данные меняет владелец и передаёт новую модель.',
    draggingRowsText3:
      'Узел никогда не ложится внутрь себя или своих потомков: дерево проверяет это раньше, чем спрашивает `canDropData`. `dropTypes` перечисляет другие типы данных, которые принимает дерево, например ассеты из другого окна. У верхнего и нижнего края дерево прокручивается, а если задержать указатель над свёрнутым узлом, он развернётся. `getDragLabel` заменяет текст превью — по умолчанию это первое имя и число остальных узлов.',
    keyboardMouseTitle: 'Клавиатура и мышь',
    keyboardMouseItem:
      'Все клавиши ListView: стрелки, Home, End, листание страниц, Shift, Ctrl (⌘), Ctrl+A, буквы.',
    keyboardMouseItem2:
      'Стрелка вправо разворачивает свёрнутый узел, а на развёрнутом переходит к первому ребёнку. Стрелка влево сворачивает развёрнутый узел, а на остальных переходит к родителю.',
    keyboardMouseItem3:
      'Alt+стрелка вправо и Alt+стрелка влево разворачивают и сворачивают узел со всем поддеревом.',
    keyboardMouseItem4:
      'F2 (Enter на macOS) переименовывает строку с фокусом, если у дерева есть `onRename`.',
    keyboardMouseItem5:
      'Esc во время перетаскивания отменяет перенос. Перетаскивание с клавиатуры пока недоступно.',
    keyboardMouseItem6:
      'Клик по стрелке разворачивает или сворачивает узел, не выделяя его. Alt+клик делает то же для всего поддерева.',
    keyboardMouseItem7:
      'Если сворачивание скрывает строку с фокусом, фокус переходит на свёрнутый узел, а выделение не меняется.',
    keyboardMouseText:
      'У каждой строки есть `aria-level`, `aria-posinset`, `aria-setsize`, а у узлов с детьми — `aria-expanded`, поэтому скринридеры объявляют структуру, хотя строки нарисованы плоским списком. Отступ уровня — токен `--size-tree-indent`.',
  },
});
