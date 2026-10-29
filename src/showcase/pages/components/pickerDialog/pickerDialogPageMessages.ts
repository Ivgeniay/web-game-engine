import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const pickerDialogPageMessages = defineDocMessages({
  en: {
    pageTitle: 'PickerDialog',
    pageDescription:
      'A dialog to choose one item from a large set, with a search, tabs, a list or a grid of previews.',
    pickerTitle: 'Choosing an item',
    pickerText:
      '`PickerDialog` is the analog of the Object Picker in Unity. `tabs` are the sources of items: each has a translated `label` and `getItemIds`; with one tab the tab buttons are not shown. The first item is always None, it chooses `null`. The search filters the items of the current tab by their labels, `loadThumbnail` gives the previews of the grid.',
    pickerText2:
      "The dialog follows the value change protocol. A click or the arrows choose an item with `'preview'`, so the field behind the dialog shows the choice at once. Enter, a double click or Select close the dialog with `'commit'`. Esc and Cancel return the value the dialog was opened with, with `'cancel'`. The owner passes the same setter as to the field and closes the dialog in `onClose`.",
    keyboardTitle: 'Keyboard and view',
    keyboardText:
      'The focus starts in the search; Down moves it into the results, where the arrows move in a grid or a list, as in a [GridView](components/grid-view). The view buttons switch between the list and the grid, the slider under the grid changes the size of the icons. The tabs are a [ToggleButtonGroup](components/toggle-button-group) until there is a Tabs component. The labels are translated by `usePickerDialogLabels` from `@/state/fields`.',
  },
  ru: {
    pageTitle: 'PickerDialog',
    pageDescription:
      'Диалог выбора одного элемента из большого набора: поиск, вкладки, список или сетка превью.',
    pickerTitle: 'Выбор элемента',
    pickerText:
      '`PickerDialog` — аналог окна Object Picker в Unity. `tabs` — источники элементов: у каждого переведённая подпись `label` и `getItemIds`; при одной вкладке кнопки вкладок не показываются. Первый элемент — всегда «Нет», он выбирает `null`. Поиск фильтрует элементы текущей вкладки по подписям, `loadThumbnail` даёт превью для сетки.',
    pickerText2:
      "Диалог следует протоколу изменения значения. Клик или стрелки выбирают элемент с `'preview'`, поэтому поле за диалогом сразу показывает выбор. Enter, двойной клик или «Выбрать» закрывают диалог с `'commit'`. Esc и «Отмена» возвращают значение, с которым диалог открыли, с `'cancel'`. Владелец передаёт тот же сеттер, что и полю, и закрывает диалог в `onClose`.",
    keyboardTitle: 'Клавиатура и вид',
    keyboardText:
      'Фокус сначала в поиске; стрелка вниз переводит его в результаты, где стрелки ходят по сетке или списку, как в [GridView](components/grid-view). Кнопки вида переключают список и сетку, ползунок под сеткой меняет размер значков. Вкладки — это [ToggleButtonGroup](components/toggle-button-group), пока нет компонента Tabs. Подписи переводит `usePickerDialogLabels` из `@/state/fields`.',
  },
});
