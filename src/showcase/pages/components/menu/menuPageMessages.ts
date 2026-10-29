import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const menuPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Menu',
    pageDescription:
      'A list of commands with submenus, opened from a button or at a point on the screen.',
    menuButtonTitle: 'A menu on a button',
    menuButtonText:
      '`Menu` shows a list of commands. Items are data, an array of `MenuItem`, not markup, so menus can be built from registries. The `trigger` function receives the props of the button that opens the menu; spread them on any primitive, including its `ref`. The menu is named after its trigger for screen readers.',
    menuButtonText2:
      "A press on the trigger opens the menu with the focus on the first available item. The example is a toolbar: the menu button stays part of the toolbar's arrow order, and the arrows inside the open menu move only through the menu.",
    kindsItemsTitle: 'Kinds of items',
    kindsItemsText: 'Every item has a unique `id` and a `kind`:',
    kindsItemsItem:
      '`action` runs `onSelect`; it may have an `icon`, a `shortcut` string and `disabled`;',
    kindsItemsItem2:
      '`checkbox` shows a check mark for `checked` and reports the switched value to `onCheckedChange`;',
    kindsItemsItem3:
      '`radio-group` is a group of `options` with one chosen `value`, reported to `onValueChange`;',
    kindsItemsItem4:
      '`submenu` holds nested `items` and opens on hover, with a short delay and a corridor for the pointer, or with Right;',
    kindsItemsItem5: '`separator` draws a line, `section` a small heading.',
    kindsItemsText2:
      'Choosing any item closes the whole menu, and the focus returns to the trigger. The shortcut is only shown: running commands by shortcuts is the job of the shortcut mechanism.',
    menuAtTitle: 'A menu at a point',
    menuAtText:
      'Without a trigger, a menu opens at a point on the screen: pass `point` with `x` and `y` in viewport coordinates, a `label` for screen readers and `onClose`. The menu is open while the point is set, and `onClose` asks to clear it. This is the base of context menus: set the point in an `onContextMenu` handler. After closing, the focus returns to where it was.',
    keyboardTitle: 'Keyboard',
    keyboardItem: 'Enter, Space and Down open a menu from its trigger.',
    keyboardItem2:
      'Up and Down move through the items and wrap around the ends, Home and End go to the first and the last item. Disabled items are skipped. Typing the first letters of an item moves to it.',
    keyboardItem3: 'Enter and Space choose the item.',
    keyboardItem4: 'Right opens a submenu, Left and Esc close the current level.',
    keyboardItem5: 'A click outside closes the menu.',
    controlOutsideTitle: 'Control from outside',
    controlOutsideText:
      'By default a menu with a trigger keeps its open state itself. Pass `open` and `onOpenChange` to decide it from outside, for example to switch between the menus of a menu bar. `onOpenChange` also works alone, as a notification.',
    controlOutsideText2:
      '`onNavigateOut` is called with `previous` or `next` when Left or Right is pressed on the top level of a menu where they have no meaning of their own: Right on an item without a submenu, Left anywhere on the top level. A menu bar uses it to move to the neighbouring menu.',
  },
  ru: {
    pageTitle: 'Menu',
    pageDescription: 'Список команд с подменю, который открывается от кнопки или в точке экрана.',
    menuButtonTitle: 'Меню на кнопке',
    menuButtonText:
      '`Menu` показывает список команд. Пункты — данные, массив `MenuItem`, а не разметка, поэтому меню можно строить из реестров. Функция `trigger` получает пропсы кнопки, которая открывает меню; разверните их на любом примитиве, включая его `ref`. Для скринридеров меню называется по своему триггеру.',
    menuButtonText2:
      'Нажатие на триггер открывает меню с фокусом на первом доступном пункте. Пример — панель инструментов: кнопка меню остаётся в порядке стрелок панели, а стрелки внутри открытого меню ходят только по меню.',
    kindsItemsTitle: 'Виды пунктов',
    kindsItemsText: 'У каждого пункта уникальный `id` и вид `kind`:',
    kindsItemsItem:
      '`action` вызывает `onSelect`; у него могут быть `icon`, строка `shortcut` и `disabled`;',
    kindsItemsItem2:
      '`checkbox` показывает галочку для `checked` и сообщает переключённое значение в `onCheckedChange`;',
    kindsItemsItem3:
      '`radio-group` — группа `options` с одним выбранным `value`, о котором узнаёт `onValueChange`;',
    kindsItemsItem4:
      '`submenu` содержит вложенные `items` и открывается при наведении — с небольшой задержкой и коридором для указателя — или стрелкой вправо;',
    kindsItemsItem5: '`separator` рисует линию, `section` — маленький заголовок.',
    kindsItemsText2:
      'Выбор любого пункта закрывает всё меню, и фокус возвращается на триггер. Сочетание только показывается: выполнять команды по сочетаниям — работа механизма горячих клавиш.',
    menuAtTitle: 'Меню в точке',
    menuAtText:
      'Без триггера меню открывается в точке экрана: передайте `point` с `x` и `y` в координатах окна просмотра, `label` для скринридеров и `onClose`. Меню открыто, пока точка задана, а `onClose` просит её сбросить. На этом построены контекстные меню: задайте точку в обработчике `onContextMenu`. После закрытия фокус возвращается туда, где был.',
    keyboardTitle: 'Клавиатура',
    keyboardItem: 'Enter, пробел и стрелка вниз открывают меню с его триггера.',
    keyboardItem2:
      'Стрелки вверх и вниз ходят по пунктам по кругу, Home и End ведут к первому и последнему пункту. Отключённые пункты пропускаются. Набор первых букв пункта переходит к нему.',
    keyboardItem3: 'Enter и пробел выбирают пункт.',
    keyboardItem4:
      'Стрелка вправо открывает подменю, стрелка влево и Esc закрывают текущий уровень.',
    keyboardItem5: 'Клик снаружи закрывает меню.',
    controlOutsideTitle: 'Управление снаружи',
    controlOutsideText:
      'По умолчанию меню с триггером само хранит, открыто ли оно. Передайте `open` и `onOpenChange`, чтобы решать это снаружи, например чтобы переключаться между меню главного меню. `onOpenChange` работает и сам по себе, как уведомление.',
    controlOutsideText2:
      '`onNavigateOut` вызывается с `previous` или `next`, когда стрелку влево или вправо нажали на верхнем уровне меню там, где у неё нет своего смысла: стрелка вправо на пункте без подменю, стрелка влево где угодно на верхнем уровне. Главное меню переходит так к соседнему меню.',
  },
});
