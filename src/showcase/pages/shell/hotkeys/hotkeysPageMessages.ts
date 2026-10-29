import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const hotkeysPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Hotkeys',
    pageDescription:
      'Shortcuts of commands: key matching in any layout, scopes, text fields, platform labels and reserved shortcuts.',
    declaringShortcutTitle: 'Declaring a shortcut',
    declaringShortcutText:
      "A shortcut belongs to a command: `shortcut: { keys: 'Mod+Shift+KeyZ' }`. The key is a `KeyboardEvent.code` value such as `KeyZ`, `Digit1`, `F2` or `Delete`. The modifiers are `Mod`, `Alt` and `Shift`, always in this order. `Mod` is Ctrl on Windows and Linux and ⌘ on macOS, like `%` in Unity menu paths. A separate Control modifier on macOS is not supported yet.",
    declaringShortcutText2:
      'The string is checked by the compiler, and it is easy to store: user remapping, which will come later, will replace `keys` by command id. Two more fields are optional: `scope` (see below) and `allowInTextInput`.',
    whichKeyTitle: 'Which key matches',
    whichKeyText: 'Shortcuts must work in any keyboard layout, so the key is compared in two ways:',
    whichKeyItem:
      '**Letters.** If the pressed key types a Latin letter, the letter is compared: `Mod+KeyZ` fires on the key labelled Z in AZERTY and in Dvorak, wherever that key is. If it types another character, such as Cyrillic in the Russian layout or a symbol made with Option on macOS, the physical key is compared: `Mod+KeyS` fires on the key that types Ы.',
    whichKeyItem2:
      '**Digits, punctuation and other keys** are always compared by the physical key. Their labels are shown as on the US layout.',
    showingShortcutTitle: 'Showing a shortcut',
    showingShortcutText:
      '`formatShortcut(keys, platform)` builds the string for `Kbd`: symbols ⌥ ⇧ ⌘ without separators on macOS, `Ctrl+Alt+Shift+…` elsewhere. Components use `useFormatShortcut()`, which formats for the current platform. The platform is detected once in the entry point with `detectPlatform(navigator)` and passed down with `PlatformProvider`.',
    showingShortcutText2:
      'Key names (Ctrl, Shift, Enter, Space and the symbols) are not translated, just like language names: users know them in this form in every language.',
    scopesTitle: 'Scopes',
    scopesText:
      "A shortcut without `scope` is global. A named scope is declared by markup: spread `hotkeyScopeProps('hierarchy')` on the root element of a window or an area. Make that element focusable, so that a click on it moves the focus inside.",
    scopesText2:
      "The active scopes are the scopes around the focused element, from the nearest to the farthest, and the global scope comes last. The first matching command that is enabled runs. A disabled command passes the key on to a wider scope, but the browser action is prevented anyway, so a disabled Save never opens the browser's save dialog.",
    scopesText3:
      'In the example the same Delete key runs a different command in each area. Each example on this page creates its own registries and attaches the controller to its own root element, so the shortcuts work only inside it.',
    whenShortcutsTitle: 'When shortcuts do not fire',
    whenShortcutsItem:
      "While the focus is in a text field, a text area, a select or editable content, shortcuts without Mod or Alt never fire: the keys belong to typing. Shortcuts with Mod or Alt fire only when the command sets `allowInTextInput`, like Run the line in the example. Function keys F1 to F12 type nothing, so with `allowInTextInput` they fire in a field even without modifiers: F6 moves to the next area from a field. `allowInTextInput: 'whenCommitted'` lets a shortcut fire only in a text or number field without uncommitted typing, and never in other text inputs: Undo and Redo use it, so Mod+Z undoes the typing first and the editor changes after the commit.",
    whenShortcutsItem2:
      'Shortcuts on Space and Enter, such as Shift+Space, do not fire while the focus is on an element that these keys activate: a button, a checkbox, a radio button, a link or a menu item. The key stays with the element, so Shift+Space on a focused button does not maximize the window.',
    whenShortcutsItem3:
      'While global shortcuts are blocked, only the scopes around the focus work. The editor blocks them while a dialog, a menu or a list is open: these elements handle their own keys.',
    whenShortcutsItem4:
      'A key that a component has already handled with `preventDefault` is left alone, and so are characters typed with AltGr and keys pressed during text composition.',
    shortcutsFrameworkTitle: 'Shortcuts of the framework',
    shortcutsFrameworkItem: 'Shift+Space maximizes the active window and restores the layout.',
    shortcutsFrameworkItem2:
      'Alt+PageDown and Alt+PageUp switch to the next and previous tab of the group.',
    shortcutsFrameworkItem3:
      'F6 and Shift+F6 move the focus between the menu, the toolbar, the active window and the status bar. They work in fields too.',
    shortcutsFrameworkText:
      'Ctrl+Tab and Ctrl+PageUp/PageDown, which other editors use for tabs, are taken by the browser and cannot be used.',
    startingControllerTitle: 'Starting the controller',
    startingControllerText:
      '`startHotkeyController({ commands, target, platform, areGlobalHotkeysBlocked })` listens to `keydown` on the target and returns the function that stops it. The editor starts it in the entry point on `document`. The controller rebuilds the key map whenever the set of handled commands changes.',
    startingControllerText2:
      'The controller lives in `core` and knows nothing about popups, so the caller tells it when global shortcuts are blocked. The editor passes `() => isKeyboardCapturedByPopup(document)` from `@/shell/popupKeyboardCapture`: it is true while a dialog, a menu or a list is open.',
    errorsTitle: 'Errors',
    errorsText:
      'The following are errors: in development they throw from the registration, in production they are logged and the shortcut is ignored.',
    errorsItem: 'Two commands with the same shortcut in the same scope.',
    errorsItem2:
      'A default shortcut that the browser or the operating system keeps for itself. Such a shortcut would work on some machines and silently fail on others. The list is `RESERVED_SHORTCUTS` in `@/core/hotkeys/reservedShortcuts`. It follows the reserved commands in the sources of Chromium and Firefox and the known behavior of Safari. Mod+P is not reserved: all three browsers let the page take it from printing.',
  },
  ru: {
    pageTitle: 'Горячие клавиши',
    pageDescription:
      'Сочетания команд: сравнение клавиш в любой раскладке, области, текстовые поля, подписи для платформы и зарезервированные сочетания.',
    declaringShortcutTitle: 'Объявление сочетания',
    declaringShortcutText:
      "Сочетание принадлежит команде: `shortcut: { keys: 'Mod+Shift+KeyZ' }`. Клавиша — значение `KeyboardEvent.code`, например `KeyZ`, `Digit1`, `F2` или `Delete`. Модификаторы — `Mod`, `Alt` и `Shift`, всегда в этом порядке. `Mod` — это Ctrl на Windows и Linux и ⌘ на macOS, как `%` в путях меню Unity. Отдельный модификатор Control на macOS пока не поддерживается.",
    declaringShortcutText2:
      'Строку проверяет компилятор, и её легко хранить: переназначение сочетаний пользователем, которое появится позже, будет заменять `keys` по id команды. Ещё два поля необязательны: `scope` (см. ниже) и `allowInTextInput`.',
    whichKeyTitle: 'Какая клавиша совпадает',
    whichKeyText:
      'Сочетания должны работать в любой раскладке, поэтому клавиша сравнивается двумя способами:',
    whichKeyItem:
      '**Буквы.** Если нажатая клавиша печатает латинскую букву, сравнивается буква: `Mod+KeyZ` срабатывает на клавише с буквой Z в AZERTY и в Dvorak, где бы она ни была. Если клавиша печатает другой символ, например кириллицу в русской раскладке или символ с Option на macOS, сравнивается физическая клавиша: `Mod+KeyS` срабатывает на клавише, которая печатает Ы.',
    whichKeyItem2:
      '**Цифры, знаки препинания и остальные клавиши** всегда сравниваются по физической клавише. Их названия показываются как в раскладке US.',
    showingShortcutTitle: 'Показ сочетания',
    showingShortcutText:
      '`formatShortcut(keys, platform)` строит строку для `Kbd`: символы ⌥ ⇧ ⌘ без разделителей на macOS и `Ctrl+Alt+Shift+…` на остальных платформах. Компоненты пользуются `useFormatShortcut()`, который форматирует для текущей платформы. Платформа определяется один раз в точке входа через `detectPlatform(navigator)` и передаётся вниз через `PlatformProvider`.',
    showingShortcutText2:
      'Названия клавиш (Ctrl, Shift, Enter, Space и символы) не переводятся, как и названия языков: пользователи знают их в таком виде на любом языке.',
    scopesTitle: 'Области',
    scopesText:
      "Сочетание без `scope` глобальное. Именованная область объявляется разметкой: разверните `hotkeyScopeProps('hierarchy')` на корневом элементе окна или области. Сделайте этот элемент фокусируемым, чтобы клик по нему переводил фокус внутрь.",
    scopesText2:
      'Активные области — это области вокруг элемента с фокусом, от ближайшей к дальней, а глобальная — последней. Срабатывает первая подходящая включённая команда. Отключённая команда передаёт клавишу более широкой области, но действие браузера всё равно отменяется, поэтому отключённое Save никогда не откроет диалог сохранения браузера.',
    scopesText3:
      'В примере одна и та же клавиша Delete выполняет разные команды в разных областях. Каждый пример на этой странице создаёт свои реестры и подключает контроллер к своему корневому элементу, поэтому сочетания работают только внутри него.',
    whenShortcutsTitle: 'Когда сочетания не срабатывают',
    whenShortcutsItem:
      "Пока фокус в текстовом поле, многострочном поле, списке выбора или редактируемом содержимом, сочетания без Mod или Alt не срабатывают никогда: клавиши принадлежат вводу. Сочетания с Mod или Alt срабатывают, только если у команды задан `allowInTextInput`, как у Run the line в примере. Функциональные клавиши F1–F12 ничего не печатают, поэтому с `allowInTextInput` они срабатывают в поле и без модификаторов: F6 переходит из поля к следующей области. `allowInTextInput: 'whenCommitted'` разрешает сочетание только в текстовом или числовом поле без незафиксированного ввода и никогда в других текстовых полях: так устроены Undo и Redo, поэтому Mod+Z сначала отменяет набранный текст, а изменения редактора — после фиксации.",
    whenShortcutsItem2:
      'Сочетания на Space и Enter, например Shift+Space, не срабатывают, пока фокус на элементе, который эти клавиши активируют: на кнопке, флажке, радиокнопке, ссылке или пункте меню. Клавиша остаётся за элементом, поэтому Shift+Space на кнопке с фокусом не развернёт окно.',
    whenShortcutsItem3:
      'Пока глобальные сочетания заблокированы, работают только области вокруг фокуса. Редактор блокирует их, пока открыт диалог, меню или список: эти элементы обрабатывают свои клавиши сами.',
    whenShortcutsItem4:
      'Клавишу, которую компонент уже обработал с `preventDefault`, контроллер не трогает, как и символы, набранные с AltGr, и клавиши, нажатые во время составного ввода.',
    shortcutsFrameworkTitle: 'Сочетания каркаса',
    shortcutsFrameworkItem: 'Shift+Space разворачивает активное окно и возвращает раскладку.',
    shortcutsFrameworkItem2:
      'Alt+PageDown и Alt+PageUp переключают на следующую и предыдущую вкладку группы.',
    shortcutsFrameworkItem3:
      'F6 и Shift+F6 переводят фокус между меню, панелью инструментов, активным окном и строкой состояния. Они работают и в полях.',
    shortcutsFrameworkText:
      'Ctrl+Tab и Ctrl+PageUp/PageDown, которыми вкладки переключают в других редакторах, заняты браузером, и использовать их нельзя.',
    startingControllerTitle: 'Запуск контроллера',
    startingControllerText:
      '`startHotkeyController({ commands, target, platform, areGlobalHotkeysBlocked })` слушает `keydown` на цели и возвращает функцию, которая его останавливает. Редактор запускает его в точке входа на `document`. Контроллер перестраивает карту клавиш при каждом изменении набора обрабатываемых команд.',
    startingControllerText2:
      'Контроллер живёт в `core` и ничего не знает о всплывающих элементах, поэтому вызывающий сам сообщает ему, когда глобальные сочетания заблокированы. Редактор передаёт `() => isKeyboardCapturedByPopup(document)` из `@/shell/popupKeyboardCapture`: оно истинно, пока открыт диалог, меню или список.',
    errorsTitle: 'Ошибки',
    errorsText:
      'Ошибками считается следующее: в режиме разработки они бросают исключение из регистрации, в production записываются в консоль, а сочетание игнорируется.',
    errorsItem: 'Две команды с одним сочетанием в одной области.',
    errorsItem2:
      'Сочетание по умолчанию, которое браузер или операционная система оставляют себе. Такое сочетание работало бы на одних машинах и молча не работало бы на других. Список — `RESERVED_SHORTCUTS` в `@/core/hotkeys/reservedShortcuts`. Он следует зарезервированным командам в исходниках Chromium и Firefox и известному поведению Safari. Mod+P не зарезервирован: все три браузера позволяют странице забрать его у печати.',
  },
});
