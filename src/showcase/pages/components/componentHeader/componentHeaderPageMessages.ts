import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const componentHeaderPageMessages = defineDocMessages({
  en: {
    pageTitle: 'ComponentHeader',
    pageDescription: 'The header of an inspector section: collapse, enable, title, help and menu.',
    titleInspectorTitle: 'The title of an inspector section',
    titleInspectorText:
      "`ComponentHeader` is the header of a component in the inspector, and it wraps the component's content as its children. It collapses like a `Foldout`: `expanded` with `onExpandedChange`, a click on the arrow, the title or the empty part of the header, and Alt+click for the nested groups.",
    titleInspectorText2:
      'The other parts are optional and come in pairs of a handler and a ready text:',
    titleInspectorItem: '`icon` after the arrow;',
    titleInspectorItem2:
      '`enabled` with `onEnabledChange` and `enabledLabel` shows the checkbox that switches the component on and off, as on Light or Rigidbody;',
    titleInspectorItem3: '`onHelp` with `helpLabel` shows the help button;',
    titleInspectorItem4:
      '`menuItems` with `menuLabel` shows the menu button. A right click on the header, Shift+F10 and the context menu key open the same menu.',
    titleInspectorText3:
      'The header does not know what the menu holds. An integration builds the items, for example from the context menu registry of the editor. Clicks on the checkbox and the buttons do not collapse the section. The body stacks its children in a column with a small gap, like the content of a `Foldout`.',
    keyboardTitle: 'Keyboard',
    keyboardText:
      'The collapse toggle, the checkbox and each button are separate Tab stops. The toggle is named by the title. Enter and Space toggle the section, Right expands and Left collapses it. After the menu closes, the focus returns where it was.',
  },
  ru: {
    pageTitle: 'ComponentHeader',
    pageDescription:
      'Заголовок секции инспектора: сворачивание, включение, название, справка и меню.',
    titleInspectorTitle: 'Заголовок секции инспектора',
    titleInspectorText:
      '`ComponentHeader` — заголовок компонента в инспекторе; содержимое компонента он оборачивает как дочерние элементы. Сворачивается он как `Foldout`: `expanded` с `onExpandedChange`, клик по стрелке, названию или пустой части заголовка и Alt+клик для вложенных групп.',
    titleInspectorText2:
      'Остальные части необязательны и идут парами — обработчик и готовый текст:',
    titleInspectorItem: '`icon` — после стрелки;',
    titleInspectorItem2:
      '`enabled` с `onEnabledChange` и `enabledLabel` показывает флажок, который включает и выключает компонент, как у Light или Rigidbody;',
    titleInspectorItem3: '`onHelp` с `helpLabel` показывает кнопку справки;',
    titleInspectorItem4:
      '`menuItems` с `menuLabel` показывает кнопку меню. Правый клик по заголовку, Shift+F10 и клавиша контекстного меню открывают то же меню.',
    titleInspectorText3:
      'Заголовок не знает, что лежит в меню. Пункты строит интеграция, например из реестра контекстных меню редактора. Клики по флажку и кнопкам не сворачивают секцию. Тело выстраивает дочерние элементы столбцом с небольшим промежутком, как содержимое `Foldout`.',
    keyboardTitle: 'Клавиатура',
    keyboardText:
      'Переключатель сворачивания, флажок и каждая кнопка — отдельные остановки Tab. Переключатель называется по названию секции. Enter и пробел сворачивают и разворачивают секцию, стрелка вправо разворачивает, влево сворачивает. После закрытия меню фокус возвращается туда, где был.',
  },
});
