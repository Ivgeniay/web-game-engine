import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const propertyRowPageMessages = defineDocMessages({
  en: {
    pageTitle: 'PropertyRow',
    pageDescription: 'An inspector line with a caption, a field and a shared caption column.',
    captionFieldTitle: 'Caption and field',
    captionFieldText:
      'A property row is the inspector line "caption — field". It takes the caption as `label` and draws the field with a function in `children`: the function receives `id` for the field and `labelId` of the caption. Give `id` to the field so a click on the caption focuses it and screen readers read the caption as the field name. Fields named with `aria-labelledby`, such as Checkbox and Select, get `labelId` as well. The caption is not a Tab stop.',
    captionFieldText2:
      "`drag` makes the caption a drag zone for a number, as in Unity: drag the captions of Mass and Solver iterations. The drag target is the same as in `useValueDrag`, and its `onValueChange` usually is the same handler as the field's, since both speak the same protocol.",
    captionFieldText3:
      '`PropertyRowGroup` lines up the rows of a window or a section: the caption column has one width for all of them, 40% by default, and the border between the columns can be dragged. The width stays within the `--size-property-*` limits and is not saved between sessions. A row outside a group uses the default width.',
    depthSlotsTitle: 'Depth, slots and the property menu',
    depthSlotsText:
      '`depth` indents the caption of a nested property; fields stay in one column. `modified` draws a mark at the left edge of the row: the value differs from the default. `reset` with a `label` and `onReset` adds a reset button right of the field; it is shown only while `modified` is true and keeps its place otherwise, so fields stay in one column. A row with `modified`, even `false`, keeps a gap for the mark.',
    depthSlotsText2:
      "`menuItems` gives the property menu: a right click on the row, or the context menu key and Shift+F10 on a field that is not a text input, opens it. The row does not build the menu itself, the items come from the owner as data of the Menu component. Text inputs keep the browser's own menu with copy and paste.",
    otherPropsTitle: 'Other props',
    otherPropsText:
      '`disabled` shows the caption in the disabled color and turns off the drag; the field itself is disabled by its own prop. `className` goes to the row and is meant only for layout.',
  },
  ru: {
    pageTitle: 'PropertyRow',
    pageDescription: 'Строка инспектора с подписью, полем и общей колонкой подписей.',
    captionFieldTitle: 'Подпись и поле',
    captionFieldText:
      'Строка свойства — строка инспектора «подпись — поле». Подпись она принимает как `label`, а поле рисует функцией в `children`: функция получает `id` для поля и `labelId` подписи. Отдайте `id` полю, тогда клик по подписи переведёт в него фокус, а скринридеры прочитают подпись как имя поля. Поля, которые называются через `aria-labelledby`, например Checkbox и Select, получают ещё и `labelId`. Подпись не является остановкой Tab.',
    captionFieldText2:
      '`drag` делает подпись зоной перетаскивания числа, как в Unity: потяните подписи Mass и Solver iterations. Цель перетаскивания та же, что в `useValueDrag`, и её `onValueChange` обычно тот же обработчик, что у поля: оба говорят на одном протоколе.',
    captionFieldText3:
      '`PropertyRowGroup` выравнивает строки окна или секции: у колонки подписей одна ширина для всех строк, по умолчанию 40%, а границу между колонками можно перетаскивать. Ширина остаётся в пределах `--size-property-*` и не сохраняется между сессиями. Строка вне группы берёт ширину по умолчанию.',
    depthSlotsTitle: 'Вложенность, слоты и меню свойства',
    depthSlotsText:
      '`depth` сдвигает подпись вложенного свойства; поля остаются в одной колонке. `modified` рисует отметку у левого края строки: значение отличается от значения по умолчанию. `reset` с подписью `label` и `onReset` добавляет справа от поля кнопку сброса; она видна, только пока `modified` истинно, а иначе сохраняет своё место, чтобы поля оставались в одной колонке. Строка с `modified`, даже `false`, оставляет зазор под отметку.',
    depthSlotsText2:
      '`menuItems` задаёт меню свойства: его открывает правый клик по строке, а на поле, которое не является текстовым вводом, — клавиша контекстного меню и Shift+F10. Сама строка меню не строит: пункты приходят от владельца данными компонента Menu. Текстовые поля оставляют родное меню браузера с копированием и вставкой.',
    otherPropsTitle: 'Остальные пропсы',
    otherPropsText:
      '`disabled` показывает подпись цветом отключённого элемента и выключает перетаскивание; само поле отключается своим пропсом. `className` уходит на строку и нужен только для раскладки.',
  },
});
