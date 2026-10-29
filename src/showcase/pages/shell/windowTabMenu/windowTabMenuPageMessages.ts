import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const windowTabMenuPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Window tab menu',
    pageDescription:
      'The menu of a tab with the items of the window and the framework, the Window menu and the docking shortcuts.',
    openingTitle: 'Opening',
    openingText:
      'Every group of tabs has a menu button at the right of its tabs. A right click on a tab, or Shift+F10 and the context menu key on a focused tab, opens the same menu for that tab. The button is an ordinary Tab stop; inside the menu the keyboard works as in any menu.',
    itemsTitle: 'Items',
    itemsText: 'The framework always adds its items at the end of the menu:',
    itemsItem: 'Maximize, checked while the group is maximized. It restores the layout again.',
    itemsItem2: 'Close tab.',
    itemsItem3:
      'Add tab, a submenu with every registered window type. The window opens in the group of the tab. A single-instance window that is already open is disabled.',
    itemsText2:
      'A window adds its own items before them. `defineWindow` gives every window type a context menu of its own, `windowType.tabMenu`, and the integration registers items into it with `contextMenus.registerItem`, the same way as into any context menu. The target of the menu is `{ windowId, windowType }`, so a command declared as `defineCommand<WindowTabTarget>` knows which instance it serves. The items of the window and of the framework are built as separate menus, so a window may use any path, including the paths of the framework items.',
    itemsText3:
      'A multi-instance window registers the handler of its items once, together with the window type, and tells the instances apart by `target.windowId`. In the example every Inspector is locked on its own.',
    windowMenuTitle: 'Window menu',
    windowMenuText:
      'The framework does not create a Window menu. It gives `registerWindowMenuItems(editor, { menuPath, group })`, which adds an item for every registered window type to the menu at `menuPath` and follows window types registered and removed later. The item calls `workspace.open`: it opens the window or activates the open one. The integration places the menu itself and adds other items next to it, such as `resetLayoutCommand`.',
    shortcutsTitle: 'Shortcuts',
    shortcutsItem: 'Shift+Space maximizes the active window and restores the layout.',
    shortcutsItem2: 'Alt+PageDown and Alt+PageUp switch to the next and previous tab of the group.',
    shortcutsItem3:
      'F6 and Shift+F6 move the focus between the areas of the editor: the menu, the toolbar, the active window and the status bar.',
    shortcutsText:
      'The [Hotkeys](shell/hotkeys) page explains how these shortcuts behave in fields and on buttons.',
  },
  ru: {
    pageTitle: 'Меню вкладки окна',
    pageDescription: 'Меню вкладки с пунктами окна и каркаса, меню Window и сочетания докинга.',
    openingTitle: 'Открытие',
    openingText:
      'У каждой группы вкладок справа от вкладок есть кнопка меню. Правый клик по вкладке или Shift+F10 и клавиша контекстного меню на вкладке с фокусом открывают то же меню для этой вкладки. Кнопка — обычная остановка Tab; внутри меню клавиатура работает как в любом меню.',
    itemsTitle: 'Пункты',
    itemsText: 'Каркас всегда добавляет свои пункты в конец меню:',
    itemsItem:
      '«Развернуть» отмечено, пока группа развёрнута. Повторный выбор возвращает раскладку.',
    itemsItem2: '«Закрыть вкладку».',
    itemsItem3:
      '«Добавить вкладку» — подменю со всеми зарегистрированными типами окон. Окно открывается в группе вкладки. Одиночное окно, которое уже открыто, отключено.',
    itemsText2:
      'Окно добавляет свои пункты перед ними. `defineWindow` даёт каждому типу окна своё контекстное меню `windowType.tabMenu`, и интеграция регистрирует в него пункты через `contextMenus.registerItem`, как в любое контекстное меню. Цель меню — `{ windowId, windowType }`, поэтому команда, объявленная как `defineCommand<WindowTabTarget>`, знает, какой экземпляр обслуживает. Пункты окна и каркаса строятся отдельными меню, поэтому окно может использовать любые пути, в том числе пути пунктов каркаса.',
    itemsText3:
      'Окно с несколькими экземплярами регистрирует обработчик своих пунктов один раз, вместе с типом окна, и различает экземпляры по `target.windowId`. В примере каждый Inspector блокируется сам по себе.',
    windowMenuTitle: 'Меню Window',
    windowMenuText:
      'Меню Window каркас не создаёт. Он даёт `registerWindowMenuItems(editor, { menuPath, group })`, которая добавляет пункт для каждого зарегистрированного типа окна в меню по пути `menuPath` и следит за типами окон, зарегистрированными и удалёнными позже. Пункт вызывает `workspace.open`: открывает окно или активирует открытое. Меню интеграция ставит сама и добавляет рядом другие пункты, например `resetLayoutCommand`.',
    shortcutsTitle: 'Сочетания клавиш',
    shortcutsItem: 'Shift+Space разворачивает активное окно и возвращает раскладку.',
    shortcutsItem2:
      'Alt+PageDown и Alt+PageUp переключают на следующую и предыдущую вкладку группы.',
    shortcutsItem3:
      'F6 и Shift+F6 переводят фокус между областями редактора: меню, панелью инструментов, активным окном и строкой состояния.',
    shortcutsText:
      'Как эти сочетания ведут себя в полях и на кнопках, объясняет страница [Горячие клавиши](shell/hotkeys).',
  },
});
