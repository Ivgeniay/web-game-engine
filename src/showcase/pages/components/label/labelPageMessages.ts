import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const labelPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Label',
    pageDescription: 'A text in one of the text tones, with truncation and optional selection.',
    tonesSelectionTitle: 'Tones and selection',
    tonesSelectionText:
      '`Label` shows a ready string. `tone` picks the text color: `primary` by default, `secondary` for hints and `disabled` for unavailable items. Interface text cannot be selected in the editor; `selectable` allows selecting and copying the text, for values such as identifiers and paths. A label never receives the focus.',
    truncationTitle: 'Truncation',
    truncationText:
      'With `truncate` the text stays on one line and ends with an ellipsis when it does not fit. Only while the text is cut off, the full text is shown in a `Tooltip` on hover. Drag the corner of the box to see the tooltip appear and disappear.',
    namingFieldTitle: 'Naming a field',
    namingFieldText:
      'With `htmlFor` the label becomes a `label` element tied to the field with that id. For a field that is named by reference, give the label an `id` and pass it to the field as `aria-labelledby`, as the example does for a checkbox. `ref` receives the element, `className` is meant only for layout.',
  },
  ru: {
    pageTitle: 'Label',
    pageDescription: 'Текст в одном из тонов текста, с обрезкой и необязательным выделением.',
    tonesSelectionTitle: 'Тоны и выделение',
    tonesSelectionText:
      '`Label` показывает готовую строку. `tone` выбирает цвет текста: `primary` по умолчанию, `secondary` для пояснений и `disabled` для недоступных элементов. Текст интерфейса в редакторе выделить нельзя; `selectable` разрешает выделять и копировать текст — для значений вроде идентификаторов и путей. Подпись никогда не получает фокус.',
    truncationTitle: 'Обрезка',
    truncationText:
      'С `truncate` текст остаётся в одну строку и заканчивается многоточием, если не помещается. Только пока текст обрезан, полный текст показывается в `Tooltip` при наведении. Потяните за угол рамки, чтобы увидеть, как подсказка появляется и пропадает.',
    namingFieldTitle: 'Подпись поля',
    namingFieldText:
      'С `htmlFor` подпись становится элементом `label`, привязанным к полю с этим id. Для поля, которое называется по ссылке, дайте подписи `id` и передайте его полю как `aria-labelledby`, как в примере с флажком. `ref` получает элемент, `className` нужен только для раскладки.',
  },
});
