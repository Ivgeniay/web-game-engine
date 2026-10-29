import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const sectionHeaderPageMessages = defineDocMessages({
  en: {
    pageTitle: 'SectionHeader',
    pageDescription: 'A collapsible header of a group of properties inside a component.',
    groupTitle: 'A group inside a component',
    groupText:
      '`SectionHeader` divides the properties of one component into groups, like `BeginFoldoutHeaderGroup` in Unity. It looks stronger than a [Foldout](components/foldout): a semibold caption over a separator line, and weaker than a [ComponentHeader](components/component-header), which heads the whole component. The content is not indented, so the rows inside keep the column of captions of their `PropertyRowGroup`.',
    groupText2:
      'The state is controlled with `expanded` and `onExpandedChange`. A collapsed content stays mounted and hidden, and Alt+click acts on the nested groups, as in a Foldout. `menuItems` with `menuLabel` add a menu button on the right; the items come ready, the header does not build them.',
    keyboardTitle: 'Keyboard',
    keyboardText:
      'The header is a native button with `aria-expanded` and `aria-controls`: Enter and Space toggle it, Right expands, Left collapses, with Alt the nested groups follow. The menu button is a separate Tab stop. `disabled` turns off both.',
  },
  ru: {
    pageTitle: 'SectionHeader',
    pageDescription: 'Сворачиваемый заголовок группы свойств внутри компонента.',
    groupTitle: 'Группа внутри компонента',
    groupText:
      '`SectionHeader` делит свойства одного компонента на группы, как `BeginFoldoutHeaderGroup` в Unity. Он заметнее [Foldout](components/foldout): полужирная подпись над линией-разделителем, и слабее [ComponentHeader](components/component-header), который озаглавливает весь компонент. Содержимое не сдвигается, поэтому строки внутри сохраняют колонку подписей своей `PropertyRowGroup`.',
    groupText2:
      'Состояние управляемое: `expanded` и `onExpandedChange`. Свёрнутое содержимое остаётся смонтированным и скрытым, а Alt+клик действует на вложенные группы, как у Foldout. `menuItems` с `menuLabel` добавляют справа кнопку меню; пункты приходят готовыми, заголовок их не строит.',
    keyboardTitle: 'Клавиатура',
    keyboardText:
      'Заголовок — нативная кнопка с `aria-expanded` и `aria-controls`: Enter и пробел переключают её, стрелка вправо разворачивает, влево сворачивает, с Alt за ней следуют вложенные группы. Кнопка меню — отдельная остановка Tab. `disabled` отключает обе.',
  },
});
