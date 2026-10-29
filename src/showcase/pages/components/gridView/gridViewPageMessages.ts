import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const gridViewPageMessages = defineDocMessages({
  en: {
    pageTitle: 'GridView',
    pageDescription:
      'A grid of items with previews, a scale and the selection of a list; a list at the smallest scale.',
    gridTitle: 'A grid of previews',
    gridText:
      '`GridView` shows `itemIds` in cells: a [Thumbnail](components/thumbnail) and a caption under it. It has the same data and selection as a [ListView](components/list-view): `getLabel`, `getIcon`, `selectedIds`, `focusedId` and `selectionMode`, so `useListViewState` keeps its state too. `loadThumbnail` loads the previews; the icon from `getIcon` (by default the `file` icon) is shown until a preview is ready.',
    gridText2:
      '`cellSize` is the side of a preview in pixels, controlled by the owner. The cells keep a padding from the `--size-list-cell-padding` token and fill the width of the grid; the number of columns follows the width. At `GRID_CELL_SIZE_MIN` from `@/ui/gridView/gridScale` the grid becomes a list of rows with icons, as in Unity. The scale is usually a [Slider](components/slider) with `showField={false}` from `GRID_CELL_SIZE_MIN` to `GRID_CELL_SIZE_MAX`; move it to the left end to see the list.',
    keyboardTitle: 'Keyboard and virtualization',
    keyboardText:
      'The grid is one Tab stop and keeps the focus on itself, the active cell is set with `aria-activedescendant`. The arrows move in all four directions: Left and Right by one cell, Up and Down by one row; Down from a row over a shorter last row goes to the last item. Home, End, Page Up and Page Down, Shift and Mod with the arrows, Mod+A and the typeahead work as in the list.',
    keyboardText2:
      'Only the rows of cells in view and a margin of 5 rows are drawn, so the grid stays fast on 10,000 items. The example has 300 materials whose previews are drawn with a delay.',
  },
  ru: {
    pageTitle: 'GridView',
    pageDescription:
      'Сетка элементов с превью, масштабом и выделением как у списка; при наименьшем масштабе — список.',
    gridTitle: 'Сетка превью',
    gridText:
      '`GridView` показывает `itemIds` ячейками: [Thumbnail](components/thumbnail) и подпись под ним. Данные и выделение у неё те же, что у [ListView](components/list-view): `getLabel`, `getIcon`, `selectedIds`, `focusedId` и `selectionMode`, поэтому её состояние тоже хранит `useListViewState`. `loadThumbnail` загружает превью; пока превью не готово, видна иконка из `getIcon` (по умолчанию иконка `file`).',
    gridText2:
      '`cellSize` — сторона превью в пикселях, ею управляет владелец. Ячейки держат отступ из токена `--size-list-cell-padding` и заполняют ширину сетки; число колонок следует за шириной. При `GRID_CELL_SIZE_MIN` из `@/ui/gridView/gridScale` сетка становится списком строк с иконками, как в Unity. Масштаб обычно задаёт [Slider](components/slider) с `showField={false}` от `GRID_CELL_SIZE_MIN` до `GRID_CELL_SIZE_MAX`; сдвиньте его к левому краю, чтобы увидеть список.',
    keyboardTitle: 'Клавиатура и виртуализация',
    keyboardText:
      'Сетка — одна остановка Tab и держит фокус на себе, активную ячейку задаёт `aria-activedescendant`. Стрелки ходят во все четыре стороны: влево и вправо на ячейку, вверх и вниз на ряд; вниз из ряда над более коротким последним рядом — к последнему элементу. Home, End, Page Up и Page Down, Shift и Mod со стрелками, Mod+A и поиск по первым буквам работают как в списке.',
    keyboardText2:
      'Рисуются только ряды ячеек в поле зрения и запас по 5 рядов, поэтому сетка остаётся быстрой на 10 000 элементов. В примере 300 материалов, превью которых рисуются с задержкой.',
  },
});
