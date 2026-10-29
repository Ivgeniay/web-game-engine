import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const foldoutPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Foldout',
    pageDescription: 'A collapsible group with Alt+click for the nested groups.',
    collapsibleGroupTitle: 'A collapsible group',
    collapsibleGroupText:
      '`Foldout` shows a header with an arrow and hides or shows its content. The state is controlled: `expanded` with `onExpandedChange`, so a window can keep it, for example to restore it in the next session. The content of a collapsed group stays mounted and is only hidden, so fields inside keep their state and nested groups can follow Alt+click.',
    collapsibleGroupText2:
      'Alt+click on a header expands or collapses the group together with every group inside it, as in Unity: each nested `Foldout` calls its own `onExpandedChange`. A plain click changes only the clicked group. In the example, Alt+click on Quality opens all three levels.',
    keyboardOtherTitle: 'Keyboard and other props',
    keyboardOtherText:
      'The header is a native button with `aria-expanded` and `aria-controls`. Enter and Space toggle it, Right expands and Left collapses; with Alt the arrows act on the nested groups too. `disabled`, `ref` and other button attributes go to the header, `className` goes to the outer box and is meant only for layout. The content is indented by one step and stacks its children in a column with a small gap, so captions and rows inside need no layout of their own.',
  },
  ru: {
    pageTitle: 'Foldout',
    pageDescription: 'Сворачиваемая группа; Alt+клик сворачивает и разворачивает вложенные группы.',
    collapsibleGroupTitle: 'Сворачиваемая группа',
    collapsibleGroupText:
      '`Foldout` показывает заголовок со стрелкой и прячет или показывает содержимое. Состояние управляемое: `expanded` с `onExpandedChange`, поэтому окно может его хранить, например чтобы восстановить в следующей сессии. Содержимое свёрнутой группы остаётся смонтированным и только скрыто, поэтому поля внутри сохраняют состояние, а вложенные группы могут откликнуться на Alt+клик.',
    collapsibleGroupText2:
      'Alt+клик по заголовку разворачивает или сворачивает группу вместе со всеми вложенными, как в Unity: каждый вложенный `Foldout` вызывает свой `onExpandedChange`. Обычный клик меняет только ту группу, по которой кликнули. В примере Alt+клик по Quality открывает все три уровня.',
    keyboardOtherTitle: 'Клавиатура и остальные пропсы',
    keyboardOtherText:
      'Заголовок — нативная кнопка с `aria-expanded` и `aria-controls`. Enter и пробел переключают её, стрелка вправо разворачивает, влево сворачивает; с Alt стрелки действуют и на вложенные группы. `disabled`, `ref` и остальные атрибуты кнопки уходят на заголовок, `className` — на внешнюю рамку и нужен только для раскладки. Содержимое сдвинуто на один шаг и выстраивает дочерние элементы столбцом с небольшим промежутком, поэтому подписям и строкам внутри своя раскладка не нужна.',
  },
});
