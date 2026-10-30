import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const searchableMenuPageMessages = defineDocMessages({
  en: {
    pageTitle: 'SearchableMenu',
    pageDescription:
      'A hierarchical list with a search to choose from a large set, like adding a component.',
    menuTitle: 'A menu with levels and a search',
    menuText:
      '`SearchableMenu` is the analog of `AdvancedDropdown` in Unity, the window of Add Component. `items` is a tree of `SearchableMenuItem` with `id`, `label`, an optional `icon`, `disabled` and `children`; an item with `children` is a group. The menu opens from `trigger`, as a [Popover](components/popover), shows one level at a time with the name of the level above the rows, and calls `onSelect(id)` for a chosen item and closes.',
    menuText2:
      'While the search has text, the levels unfold into a flat list of the matching items with their path on the right. A disabled item is shown but cannot be chosen; in the example the Rigidbody is already added. The labels of the search and of the back button are translated by `useSearchableMenuLabels` from `@/state/fields`.',
    keyboardTitle: 'Keyboard',
    keyboardText:
      'The focus goes to the search at once and stays there. Up and Down move over the rows without leaving the search: the search is a combobox, and the active row is set with `aria-activedescendant`. Right and Enter enter a group, Enter chooses an item. Left and Backspace in an empty search go one level back, as does the back button. Esc clears the search first and closes the menu next.',
  },
  ru: {
    pageTitle: 'SearchableMenu',
    pageDescription:
      'Иерархический список с поиском для выбора из большого набора, как добавление компонента.',
    menuTitle: 'Меню с уровнями и поиском',
    menuText:
      '`SearchableMenu` — аналог `AdvancedDropdown` в Unity, окна Add Component. `items` — дерево `SearchableMenuItem` с `id`, `label`, необязательными `icon`, `disabled` и `children`; элемент с `children` — группа. Меню открывается от `trigger`, как [Popover](components/popover), показывает один уровень за раз с названием уровня над строками, вызывает `onSelect(id)` для выбранного элемента и закрывается.',
    menuText2:
      'Пока в поиске есть текст, уровни разворачиваются в плоский список подходящих элементов с путём справа. Отключённый элемент виден, но не выбирается; в примере Rigidbody уже добавлен. Подписи поиска и кнопки «назад» переводит `useSearchableMenuLabels` из `@/state/fields`.',
    keyboardTitle: 'Клавиатура',
    keyboardText:
      'Фокус сразу попадает в поиск и остаётся там. Стрелки вверх и вниз ходят по строкам, не уводя фокус из поиска: поиск — комбобокс, активная строка задаётся через `aria-activedescendant`. Стрелка вправо и Enter входят в группу, Enter выбирает элемент. Стрелка влево и Backspace в пустом поиске возвращают на уровень выше, как и кнопка «назад». Esc сначала очищает поиск, затем закрывает меню.',
  },
});
