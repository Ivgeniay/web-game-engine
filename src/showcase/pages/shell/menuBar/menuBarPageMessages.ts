import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const menuBarPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Menu bar',
    pageDescription:
      'The main menu built from registered paths: groups, separators, commands and keyboard access.',
    registeringMenusTitle: 'Registering menus and items',
    registeringMenusText:
      'The framework puts nothing into the main menu. Whoever registers decides which top menus exist, in which order and with which labels. Entries are registered by path, like `MenuItem` in Unity, but the path is made of ids, not labels, because labels are `MessageRef` and change with the language.',
    registeringMenusItem:
      '`mainMenu.registerMenu({ path, label, group, order })` registers a top menu (`file`) or a submenu (`file/export`).',
    registeringMenusItem2:
      '`mainMenu.registerItem({ path, command, group, order })` puts a command into a menu: `file/save`. An item needs a parent menu, and an item whose parent is not registered is not shown.',
    registeringMenusItem3:
      'Inside one level, entries are sorted by `group`, then by `order`, then by registration. A separator is drawn between groups.',
    registeringMenusItem4:
      'Every registration returns its cancel function. A duplicate path or an invalid path is an error.',
    registeringMenusText2:
      'An item refers to the command definition. Its label, icon and shortcut come from the command, and its availability and check mark come from the handler when the menu opens. A command without a handler hides its item, and a menu without visible items is hidden as well. A command with `isChecked` becomes a check item.',
    exampleTitle: 'Example',
    exampleText:
      'The engine integration registers File, Edit and View with their commands. A second extension, like a plugin, adds Publish to the existing File menu without touching the engine code. Undo is available only after a change of the mock scene. Switch the language in the header: the labels change at once.',
    keyboardMouseTitle: 'Keyboard and mouse',
    keyboardMouseItem:
      'F10 moves the focus to the first menu, and on Windows and Linux so does a single tap of Alt. Alt with another key, AltGr or a mouse button does not count. Pass `altKeyActivates={false}` to switch Alt off. On macOS only F10 works. Neither works while a dialog or a menu is open.',
    keyboardMouseItem2:
      'Left and right move between menus, Down, Enter and Space open the focused one.',
    keyboardMouseItem3:
      'While a menu is open, left and right open the neighboring menu, and hovering another menu opens it.',
    keyboardMouseItem4:
      'Escape closes the menu; on a closed menu it returns the focus to where it was before F10 or Alt. F10 or Alt in the menu bar does the same.',
    keyboardMouseItem5:
      'The command runs after the menu has closed and returned the focus, so a command may open a dialog.',
  },
  ru: {
    pageTitle: 'Главное меню',
    pageDescription:
      'Главное меню из зарегистрированных путей: группы, разделители, команды и доступ с клавиатуры.',
    registeringMenusTitle: 'Регистрация меню и пунктов',
    registeringMenusText:
      'Каркас ничего не кладёт в главное меню. Какие меню верхнего уровня есть, в каком порядке и с какими подписями, решает тот, кто их регистрирует. Записи регистрируются по пути, как `MenuItem` в Unity, но путь состоит из id, а не из подписей, потому что подписи — это `MessageRef` и меняются с языком.',
    registeringMenusItem:
      '`mainMenu.registerMenu({ path, label, group, order })` регистрирует меню верхнего уровня (`file`) или подменю (`file/export`).',
    registeringMenusItem2:
      '`mainMenu.registerItem({ path, command, group, order })` кладёт команду в меню: `file/save`. Пункту нужно родительское меню, и пункт, родитель которого не зарегистрирован, не показывается.',
    registeringMenusItem3:
      'Внутри одного уровня записи сортируются по `group`, затем по `order`, затем по порядку регистрации. Между группами рисуется разделитель.',
    registeringMenusItem4:
      'Каждая регистрация возвращает свою функцию отмены. Повторный путь или неверный путь — ошибка.',
    registeringMenusText2:
      'Пункт ссылается на описание команды. Подпись, иконка и сочетание берутся из команды, а доступность и галочка — из обработчика при открытии меню. Команда без обработчика скрывает свой пункт, а меню без видимых пунктов тоже скрыто. Команда с `isChecked` становится пунктом с галочкой.',
    exampleTitle: 'Пример',
    exampleText:
      'Интеграция движка регистрирует File, Edit и View с их командами. Второе расширение, вроде плагина, добавляет Publish в существующее меню File, не трогая код движка. Undo доступно только после изменения мок-сцены. Переключите язык в шапке: подписи сразу меняются.',
    keyboardMouseTitle: 'Клавиатура и мышь',
    keyboardMouseItem:
      'F10 переводит фокус на первое меню, а на Windows и Linux — ещё и одиночное нажатие Alt. Alt вместе с другой клавишей, AltGr или кнопкой мыши не считается. Передайте `altKeyActivates={false}`, чтобы выключить Alt. На macOS работает только F10. Ни то ни другое не работает, пока открыт диалог или меню.',
    keyboardMouseItem2:
      'Стрелки влево и вправо переходят между меню, стрелка вниз, Enter и пробел открывают меню с фокусом.',
    keyboardMouseItem3:
      'Пока меню открыто, стрелки влево и вправо открывают соседнее меню, а наведение на другое меню открывает его.',
    keyboardMouseItem4:
      'Escape закрывает меню; на закрытом меню он возвращает фокус туда, где тот был до F10 или Alt. То же делает F10 или Alt в главном меню.',
    keyboardMouseItem5:
      'Команда выполняется после того, как меню закрылось и вернуло фокус, поэтому команда может открыть диалог.',
  },
});
