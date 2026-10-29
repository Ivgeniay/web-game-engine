import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const dockingPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Docking',
    pageDescription:
      'Window types from the registry, opening, closing and maximizing windows, the active window and its hotkey scope.',
    windowTypesTitle: 'Window types',
    windowTypesText:
      'The framework has no windows of its own. The integration describes each kind of window once, at module level, with `defineWindow({ id, title, icon?, component, multiInstance? })`, and registers it at startup with `windows.register(windowType)`. Registration returns its cancellation, like every registry of the editor.',
    windowTypesItem:
      '`id` is prefixed with its part, `demo.hierarchy`. It is also the hotkey scope of the window.',
    windowTypesItem2:
      '`title` is a `MessageRef`. Tabs translate it when they render, so they follow the language without a reload.',
    windowTypesItem3:
      '`component` is an ordinary component. It receives `windowId`, the id of its instance.',
    windowTypesItem4:
      'A window is single-instance by default. A multi-instance window gets ids with a number: `example.inspector:1`, `example.inspector:2`.',
    openingClosingTitle: 'Opening and closing',
    openingClosingText:
      '`DockLayout` shows the windows. `EditorFrame` puts it into the workspace between the toolbar and the status bar. Code talks to it through `workspace` of the editor registries:',
    openingClosingItem:
      '`workspace.open(windowType)` adds the window to the active group and focuses it. A single-instance window that is already open is activated instead. The method returns the id of the window, or `null` while no dock layout is mounted.',
    openingClosingItem2:
      '`workspace.close(windowId)` closes a window, `workspace.isOpen(windowType)` tells whether one is open.',
    openingClosingItem3:
      '`workspace.maximize(windowId)` spreads the group of the window over the whole workspace, `workspace.restore()` brings the layout back and `workspace.isMaximized()` tells whether a group is maximized. The framework command `toggleMaximizeCommand` does the same for the active window and is checked while a group is maximized.',
    openingClosingItem4:
      '`workspace.getActiveWindow()` returns the active window, `workspace.subscribe` and `workspace.getVersion` follow changes.',
    openingClosingText2:
      'Tabs are dragged between groups, a tab dropped at the edge of a group splits it, and the dividers between groups are dragged with the mouse. Floating windows and moving a window into a separate browser window are turned off.',
    activeWindowTitle: 'Active window and hotkeys',
    activeWindowText:
      'The active window is the one that holds the focus. A click on an empty place of a window moves the focus into the window, a click on a tab focuses its window. The tab of the active window is marked with a line in the accent color.',
    activeWindowText2:
      "Every window is a hotkey scope with the id of its type. A command with `shortcut: { keys: 'KeyF', scope: 'example.scene' }` works only while the focus is inside a Scene window. A window brings its commands for its lifetime with `useRegistration`, the same way as any other component.",
    lookTitle: 'Look',
    lookText:
      'Dockview is styled with the tokens of the framework: backgrounds, tabs, dividers, the drop highlight `overlay-drop-target`, the font and `--size-tab-height`. The tokens live on `:root`, so switching the theme restyles the docking at once. The internal layers of dockview are isolated inside `DockLayout` and do not compete with the popup layer.',
  },
  ru: {
    pageTitle: 'Докинг',
    pageDescription:
      'Типы окон из реестра, открытие, закрытие и разворачивание окон, активное окно и его область сочетаний.',
    windowTypesTitle: 'Типы окон',
    windowTypesText:
      'Своих окон у каркаса нет. Интеграция описывает каждый вид окна один раз, на уровне модуля, через `defineWindow({ id, title, icon?, component, multiInstance? })` и регистрирует его при запуске через `windows.register(windowType)`. Регистрация возвращает свою отмену, как у любого реестра редактора.',
    windowTypesItem:
      '`id` начинается с префикса своей части: `demo.hierarchy`. Это ещё и область сочетаний окна.',
    windowTypesItem2:
      '`title` — это `MessageRef`. Вкладки переводят его при отрисовке, поэтому следуют за языком без перезагрузки.',
    windowTypesItem3:
      '`component` — обычный компонент. Он получает `windowId` — id своего экземпляра.',
    windowTypesItem4:
      'По умолчанию окно одиночное. Окно с несколькими экземплярами получает id с номером: `example.inspector:1`, `example.inspector:2`.',
    openingClosingTitle: 'Открытие и закрытие',
    openingClosingText:
      'Окна показывает `DockLayout`. `EditorFrame` ставит его в рабочую область между панелью инструментов и строкой состояния. Код обращается к нему через `workspace` из реестров редактора:',
    openingClosingItem:
      '`workspace.open(windowType)` добавляет окно в активную группу и переводит в него фокус. Если одиночное окно уже открыто, вместо этого оно активируется. Метод возвращает id окна или `null`, пока раскладка докинга не смонтирована.',
    openingClosingItem2:
      '`workspace.close(windowId)` закрывает окно, `workspace.isOpen(windowType)` говорит, открыто ли такое окно.',
    openingClosingItem3:
      '`workspace.maximize(windowId)` разворачивает группу окна на всю рабочую область, `workspace.restore()` возвращает раскладку, а `workspace.isMaximized()` говорит, развёрнута ли группа. Команда каркаса `toggleMaximizeCommand` делает то же для активного окна и отмечена, пока группа развёрнута.',
    openingClosingItem4:
      '`workspace.getActiveWindow()` возвращает активное окно, `workspace.subscribe` и `workspace.getVersion` следят за изменениями.',
    openingClosingText2:
      'Вкладки перетаскиваются между группами, вкладка, брошенная у края группы, делит её, а разделители между группами двигаются мышью. Плавающие окна и вынос окна в отдельное окно браузера выключены.',
    activeWindowTitle: 'Активное окно и горячие клавиши',
    activeWindowText:
      'Активное окно — то, в котором фокус. Клик по пустому месту окна переводит фокус в окно, клик по вкладке — в её окно. Вкладка активного окна отмечена линией акцентного цвета.',
    activeWindowText2:
      "Каждое окно — область сочетаний с id своего типа. Команда с `shortcut: { keys: 'KeyF', scope: 'example.scene' }` работает, только пока фокус внутри окна Scene. Окно приносит свои команды на время жизни через `useRegistration`, как любой другой компонент.",
    lookTitle: 'Внешний вид',
    lookText:
      'Dockview оформлен токенами каркаса: фоны, вкладки, разделители, подсветка места `overlay-drop-target`, шрифт и `--size-tab-height`. Токены живут на `:root`, поэтому смена темы сразу меняет вид докинга. Внутренние слои dockview изолированы внутри `DockLayout` и не спорят со слоем всплывающих элементов.',
  },
});
