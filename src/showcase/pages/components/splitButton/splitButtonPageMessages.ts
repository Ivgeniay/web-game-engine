import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const splitButtonPageMessages = defineDocMessages({
  en: {
    pageTitle: 'SplitButton',
    pageDescription: 'A main action and a menu of its variants in one button.',
    actionVariantsTitle: 'Action and variants',
    actionVariantsText:
      'A split button joins two buttons. The main part runs `onClick` with the `label` and an optional `icon`; the arrow opens a [Menu](components/menu) with `menuItems`, the same items as in any menu. Use it where one action is the usual one and the others are close to it: building, adding an object of a chosen type.',
    actionVariantsText2:
      '`menuLabel` names the arrow for screen readers and its hint. `variant` (`default` or `accent`) and `size` apply to both parts, and `disabled` turns both off. `ref` points to the main part, `className` goes to the wrapper and is meant only for layout.',
    keyboardTitle: 'Keyboard',
    keyboardText:
      'The main part and the arrow are two Tab stops, and inside a [Toolbar](components/toolbar) two roving stops. Enter and Space on the main part run the action; on the arrow they open the menu. Alt+ArrowDown on the main part also opens the menu, and then the focus returns to the main part when the menu closes.',
  },
  ru: {
    pageTitle: 'SplitButton',
    pageDescription: 'Основное действие и меню его вариантов в одной кнопке.',
    actionVariantsTitle: 'Действие и варианты',
    actionVariantsText:
      'Кнопка с меню объединяет две кнопки. Основная часть выполняет `onClick` с подписью `label` и необязательной иконкой `icon`; стрелка открывает [Menu](components/menu) с пунктами `menuItems`, такими же, как в любом меню. Она нужна там, где одно действие обычное, а остальные близки к нему: сборка, добавление объекта выбранного типа.',
    actionVariantsText2:
      '`menuLabel` называет стрелку для скринридеров и в её подсказке. `variant` (`default` или `accent`) и `size` действуют на обе части, а `disabled` отключает обе. `ref` указывает на основную часть, `className` уходит на обёртку и нужен только для раскладки.',
    keyboardTitle: 'Клавиатура',
    keyboardText:
      'Основная часть и стрелка — две остановки Tab, а внутри [Toolbar](components/toolbar) — две остановки роумингового фокуса. Enter и пробел на основной части выполняют действие, на стрелке — открывают меню. Alt+стрелка вниз на основной части тоже открывает меню, и тогда после закрытия меню фокус возвращается на основную часть.',
  },
});
