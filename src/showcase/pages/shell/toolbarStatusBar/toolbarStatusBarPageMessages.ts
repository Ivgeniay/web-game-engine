import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const toolbarStatusBarPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Toolbar and status bar',
    pageDescription:
      'The main toolbar and the status bar built from registered commands and components, and the editor frame.',
    mainToolbarTitle: 'Main toolbar',
    mainToolbarText:
      '`MainToolbar` draws the items of `editor.toolbar` in three zones: left, center and right. Inside a zone, items are sorted by `group` and `order`, with a separator between groups. An item is one of two kinds:',
    mainToolbarItem:
      "`{ kind: 'command', id, zone, group, order, command }` shows a command. A command with an icon becomes an icon button with its label and shortcut in the tooltip, one without an icon becomes a text button. A command with `isChecked` becomes a toggle. A command without a handler is hidden.",
    mainToolbarItem2:
      "`{ kind: 'component', id, zone, group, order, component }` shows any component of the integration, such as the resolution list of the Game window. The component reads the engine state on its own.",
    mainToolbarText2:
      'A disabled command stays in the toolbar as a focusable button with `aria-disabled`: the keyboard reaches it with the arrow keys, its tooltip explains what it is, and pressing it does nothing. Buttons get this behavior from the `focusableWhenDisabled` prop.',
    statusBarTitle: 'Status bar',
    statusBarText:
      '`StatusBar` draws the items of `editor.statusBar` in the left and right zones, sorted by `order`. Each item is a component of the integration. Set `announce: true` for an item whose changes a screen reader should read out: it gets `role="status"`. The others stay silent, so the reader does not read the whole bar on every change.',
    exampleTitle: 'Example',
    exampleText:
      'The game extension registers Play, Pause and Step in the main menu and in the toolbar, a resolution list in the toolbar and two status bar items. The mock engine calls `commands.refresh()` on every change, so the menu item and the toolbar button of a command are disabled together: Pause is available only while the game is playing, Step only while it is paused. Switch the language: the labels change at once.',
    editorFrameTitle: 'The editor frame',
    editorFrameText:
      '`EditorFrame` from `@/shell/EditorFrame` puts the parts together: the menu bar and the toolbar at the top, the status bar at the bottom and the workspace between them, where `DockLayout` shows the windows. It also hosts the confirm dialogs. The framework registers nothing by itself, so in the editor the menu and the toolbar stay empty until an integration fills them.',
  },
  ru: {
    pageTitle: 'Панель инструментов и строка состояния',
    pageDescription:
      'Главная панель инструментов и строка состояния из зарегистрированных команд и компонентов, а также каркас страницы редактора.',
    mainToolbarTitle: 'Главная панель инструментов',
    mainToolbarText:
      '`MainToolbar` рисует элементы `editor.toolbar` в трёх зонах: слева, по центру и справа. Внутри зоны элементы сортируются по `group` и `order`, между группами — разделитель. Элемент бывает одного из двух видов:',
    mainToolbarItem:
      "`{ kind: 'command', id, zone, group, order, command }` показывает команду. Команда с иконкой становится кнопкой-иконкой с подписью и сочетанием в подсказке, команда без иконки — текстовой кнопкой. Команда с `isChecked` становится переключателем. Команда без обработчика скрыта.",
    mainToolbarItem2:
      "`{ kind: 'component', id, zone, group, order, component }` показывает любой компонент интеграции, например список разрешений окна Game. Компонент сам читает состояние движка.",
    mainToolbarText2:
      'Отключённая команда остаётся в панели фокусируемой кнопкой с `aria-disabled`: клавиатура доходит до неё стрелками, подсказка объясняет, что это, а нажатие ничего не делает. Это поведение кнопки получают от пропса `focusableWhenDisabled`.',
    statusBarTitle: 'Строка состояния',
    statusBarText:
      '`StatusBar` рисует элементы `editor.statusBar` в левой и правой зонах, отсортированные по `order`. Каждый элемент — компонент интеграции. Задайте `announce: true` элементу, изменения которого скринридер должен зачитывать: он получит `role="status"`. Остальные молчат, чтобы скринридер не читал всю строку при каждом изменении.',
    exampleTitle: 'Пример',
    exampleText:
      'Игровое расширение регистрирует Play, Pause и Step в главном меню и на панели инструментов, список разрешений на панели и два элемента строки состояния. Мок-движок вызывает `commands.refresh()` при каждом изменении, поэтому пункт меню и кнопка панели одной команды гаснут одновременно: Pause доступна, только пока игра идёт, Step — только пока она на паузе. Переключите язык: подписи сразу меняются.',
    editorFrameTitle: 'Каркас страницы редактора',
    editorFrameText:
      '`EditorFrame` из `@/shell/EditorFrame` собирает части вместе: главное меню и панель инструментов сверху, строку состояния снизу и рабочую область между ними, где `DockLayout` показывает окна. Ещё он показывает диалоги подтверждения. Каркас сам ничего не регистрирует, поэтому в редакторе меню и панель инструментов пусты, пока их не наполнит интеграция.',
  },
});
