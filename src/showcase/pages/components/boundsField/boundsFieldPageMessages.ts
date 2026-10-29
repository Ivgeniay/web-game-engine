import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const boundsFieldPageMessages = defineDocMessages({
  en: {
    pageTitle: 'BoundsField',
    pageDescription: 'A volume: center and size in two property rows of three components.',
    centerSizeTitle: 'Center and size',
    centerSizeText:
      'A bounds field edits `Bounds` from `@/contracts/geometry` with a `center` and a `size`, three components each. It draws a caption and two nested [PropertyRow](components/property-row) rows with the captions `centerLabel` and `sizeLabel`, so it goes into a `PropertyRowGroup` and shares its label column. The size is the full size, not the half size that Unity calls extent.',
    centerSizeText2:
      'Every change sends the whole volume with the phase of the changed component. `mixed` takes separate flags for `center` and `size`, `depth` indents the field inside a section. Each component is named by the caption, the row and its axis, for example "Bounds Center X". A click on a row caption focuses its first component.',
  },
  ru: {
    pageTitle: 'BoundsField',
    pageDescription: 'Объём: центр и размер в двух строках свойств по три компоненты.',
    centerSizeTitle: 'Центр и размер',
    centerSizeText:
      'Поле объёма редактирует `Bounds` из `@/contracts/geometry` с `center` и `size`, по три компоненты в каждом. Оно рисует подпись и две вложенные строки [PropertyRow](components/property-row) с подписями `centerLabel` и `sizeLabel`, поэтому ставится в `PropertyRowGroup` и делит с ней колонку подписей. Размер — полный, а не половина размера, которую Unity называет extent.',
    centerSizeText2:
      'Каждое изменение отправляет весь объём с фазой изменённой компоненты. `mixed` принимает отдельные отметки для `center` и `size`, `depth` задаёт отступ поля внутри секции. Каждая компонента называется подписью, строкой и своей осью, например «Bounds Center X». Клик по подписи строки фокусирует её первую компоненту.',
  },
});
