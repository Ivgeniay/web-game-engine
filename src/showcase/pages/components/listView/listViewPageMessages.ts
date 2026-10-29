import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const listViewPageMessages = defineDocMessages({
  en: {
    pageTitle: 'ListView',
    pageDescription: 'A fast list of rows with a single or multiple selection and keyboard moves.',
    listSelectionTitle: 'A list with a selection',
    listSelectionText:
      '`ListView` does not copy the data. It takes `itemIds`, the ids of the rows in their order, and functions that read a row by its id: `getLabel` and the optional `getIcon`. Pass a new array when the rows change.',
    listSelectionText2:
      'The selection and the focused row are controlled: `selectedIds` with `onSelectedIdsChange` and `focusedId` with `onFocusedIdChange`. When the owner does not need to keep them anywhere, `useListViewState` holds them and returns the four props to spread on the list. The selected ids come in the order of the rows.',
    listSelectionText3:
      '`selectionMode` is `single` by default. In the `multiple` mode, Ctrl (⌘ on macOS) adds or removes a row, Shift selects a range from the last clicked row, and both together add a range. A click on the empty space below the rows clears the selection. A right click on a row that is not selected selects it, so a context menu acts on the row that was clicked.',
    listSelectionText4:
      'The selection is drawn with `bg-selection` while the focus is in the list and with `bg-selection-inactive` otherwise, so the active window stands out. Name the list with `aria-label` and give it a height: it scrolls inside its own box.',
    thousandsRowsTitle: 'Thousands of rows',
    thousandsRowsText:
      'The list draws only the rows in view and a few rows above and below them, so ten thousand rows scroll as fast as ten. Every row has the same height, the `--size-list-row-height` token. The focused row stays in the document while it is scrolled away, so screen readers can still read it.',
    customRowTitle: 'A custom row',
    customRowText:
      '`renderRow` draws the inside of a row. It receives the row state: `id`, `index`, `label`, `selected` and `focused`. The list still draws the row box, its height, the selection and the focus. `ListRowContent` is the standard icon and label, so a custom row can add its own parts next to them, like the time in the example.',
    keyboardTitle: 'Keyboard',
    keyboardItem:
      'The list is one Tab stop. The focus stays on the list, and the focused row is announced through `aria-activedescendant`. Without a focused row, the list focuses the first selected row or the first row.',
    keyboardItem2:
      'Up, Down, Home, End, Page Up and Page Down move the focus and select the row. With Shift they extend the selection from the anchor. With Ctrl (⌘) they move only the focus, and Ctrl+Space (⌘+Space) adds or removes the focused row.',
    keyboardItem3: 'Ctrl+A (⌘A) selects all rows in the multiple mode.',
    keyboardItem4:
      'Typing the first letters of a label moves to the row. Typing the same letter again moves to the next row that starts with it.',
    keyboardText:
      'The list joins the arrow order of a `Toolbar` or another roving focus group like any focusable control. `id`, `ref`, `className` and other attributes apply to the scrolling box.',
  },
  ru: {
    pageTitle: 'ListView',
    pageDescription:
      'Быстрый список строк с одиночным или множественным выделением и управлением с клавиатуры.',
    listSelectionTitle: 'Список с выделением',
    listSelectionText:
      '`ListView` не копирует данные. Он принимает `itemIds` — id строк в их порядке — и функции, которые читают строку по id: `getLabel` и необязательную `getIcon`. Когда строки меняются, передайте новый массив.',
    listSelectionText2:
      'Выделение и строка с фокусом управляемые: `selectedIds` с `onSelectedIdsChange` и `focusedId` с `onFocusedIdChange`. Если владельцу не нужно их нигде хранить, их держит `useListViewState` и возвращает четыре пропса, которые разворачиваются на списке. Выделенные id приходят в порядке строк.',
    listSelectionText3:
      '`selectionMode` по умолчанию `single`. В режиме `multiple` Ctrl (⌘ на macOS) добавляет или убирает строку, Shift выделяет диапазон от последней строки, по которой кликнули, а вместе они добавляют диапазон. Клик по пустому месту под строками снимает выделение. Правый клик по невыделенной строке выделяет её, чтобы контекстное меню действовало на ту строку, по которой кликнули.',
    listSelectionText4:
      'Выделение рисуется цветом `bg-selection`, пока фокус в списке, и `bg-selection-inactive` в остальное время, поэтому активное окно заметно. Назовите список через `aria-label` и задайте ему высоту: он прокручивается внутри своей рамки.',
    thousandsRowsTitle: 'Тысячи строк',
    thousandsRowsText:
      'Список рисует только видимые строки и несколько строк выше и ниже, поэтому десять тысяч строк прокручиваются так же быстро, как десять. У всех строк одна высота — токен `--size-list-row-height`. Строка с фокусом остаётся в документе, даже когда прокручена из вида, чтобы скринридеры могли её прочитать.',
    customRowTitle: 'Своя строка',
    customRowText:
      '`renderRow` рисует содержимое строки. Он получает состояние строки: `id`, `index`, `label`, `selected` и `focused`. Рамку строки, её высоту, выделение и фокус список по-прежнему рисует сам. `ListRowContent` — стандартные иконка и подпись, и своя строка может добавить рядом свои части, как время в примере.',
    keyboardTitle: 'Клавиатура',
    keyboardItem:
      'Список — одна остановка Tab. Фокус остаётся на списке, а строка с фокусом объявляется через `aria-activedescendant`. Если строки с фокусом нет, список ставит фокус на первую выделенную строку или на первую строку.',
    keyboardItem2:
      'Стрелки вверх и вниз, Home, End, Page Up и Page Down переводят фокус и выделяют строку. С Shift они расширяют выделение от якоря. С Ctrl (⌘) они переводят только фокус, а Ctrl+пробел (⌘+пробел) добавляет или убирает строку с фокусом.',
    keyboardItem3: 'Ctrl+A (⌘A) выделяет все строки в режиме множественного выделения.',
    keyboardItem4:
      'Набор первых букв подписи переходит к строке. Повторный набор той же буквы переходит к следующей строке на эту букву.',
    keyboardText:
      'Список встаёт в порядок стрелок `Toolbar` или другой группы с роуминговым фокусом, как любой фокусируемый элемент. `id`, `ref`, `className` и остальные атрибуты относятся к прокручиваемой рамке.',
  },
});
