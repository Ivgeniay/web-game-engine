import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const separatorPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Separator',
    pageDescription: 'A horizontal or vertical line between groups, or a flexible gap.',
    variantsTitle: 'Variants',
    variantsText:
      '`Separator` divides groups of elements. A line has the `separator` role and `aria-orientation`:',
    variantsItem: '`orientation="horizontal"`, the default, is a line across a column of elements;',
    variantsItem2:
      '`orientation="vertical"` is a short line between groups in a row, for example in a toolbar.',
    variantsText2:
      '`variant="flexible"` draws nothing: it is an empty gap that takes the free space of a row and pushes the elements after it to the end. It is hidden from screen readers. A separator never receives the focus.',
  },
  ru: {
    pageTitle: 'Separator',
    pageDescription: 'Горизонтальная или вертикальная линия между группами или гибкий промежуток.',
    variantsTitle: 'Варианты',
    variantsText:
      '`Separator` разделяет группы элементов. У линии роль `separator` и `aria-orientation`:',
    variantsItem: '`orientation="horizontal"`, по умолчанию, — линия поперёк столбца элементов;',
    variantsItem2:
      '`orientation="vertical"` — короткая линия между группами в ряду, например в панели инструментов.',
    variantsText2:
      '`variant="flexible"` ничего не рисует: это пустой промежуток, который занимает свободное место ряда и отодвигает элементы после себя к концу. Он скрыт от скринридеров. Разделитель никогда не получает фокус.',
  },
});
