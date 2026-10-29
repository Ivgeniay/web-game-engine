import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const commandsPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Commands',
    pageDescription:
      'Command definitions and handlers, the integration entry point and registration for the lifetime of a component.',
    definitionsHandlersTitle: 'Definitions and handlers',
    definitionsHandlersText:
      'A command is split in two parts. The **definition** is data: an id, a label and an optional icon and default shortcut. `defineCommand` creates it once at module level. The **handler** is behavior: `run`, and optionally `isEnabled` and `isChecked`. Whoever can execute the command registers the handler: the engine integration at startup or a window while it is open.',
    definitionsHandlersText2:
      'Menu items and toolbar buttons refer to the definition object, not to an id string, so a typo is a compile error. A command without a registered handler is hidden wherever it is referenced.',
    definitionsHandlersItem:
      '`id` is unique in the editor. Use a prefix of your part: `scene.save`, `inspector.lock`. It is also the key for the future user remapping of shortcuts.',
    definitionsHandlersItem2:
      '`label` is a `MessageRef`, so labels follow the language without a reload.',
    definitionsHandlersItem3:
      "`shortcut` is written with physical key codes: `{ keys: 'Mod+Shift+KeyS' }`. `Mod` is Ctrl on Windows and Linux and ⌘ on macOS. The modifiers go in the order `Mod`, `Alt`, `Shift`, and the compiler rejects any other order or an unknown key.",
    registriesIntegrationTitle: 'Registries and the integration entry point',
    registriesIntegrationText:
      'The registries of the editor are created by `createEditorRegistries` in the entry point and passed down with `RegistriesProvider`, just like the theme and language stores. There are no global registries: a test or an example creates its own isolated set. Components reach the registries with `useEditorRegistries`.',
    registriesIntegrationText2:
      'An integration connects through one function of the `EditorExtension` type from `@/state/registries/editorExtension`. It receives the registries, registers its elements and returns a function that cancels all of them. Every `register` or `handle` call returns its own cancel function; join several with `combineUnsubscribes` from `@/core/unsubscribe`.',
    availabilityAtTitle: 'Availability at the moment of display',
    availabilityAtText:
      '`isEnabled` and `isChecked` are evaluated when the command is shown: when a menu opens and when a toolbar button renders. A menu item and a button of the same command read the same handler, so they become disabled together.',
    availabilityAtText2:
      'A toolbar is always on screen, so it has to learn when the engine state changes. Call `commands.refresh()` after such a change: every component that shows a command through `useCommandState` evaluates it again. Registering or removing a handler refreshes them by itself.',
    availabilityAtText3:
      'In the example the integration handles `scene.save` at startup. The command is available only while the mock scene has changes, and the button follows it.',
    registeringLifetimeTitle: 'Registering for the lifetime of a component',
    registeringLifetimeText:
      'A window that brings its own commands registers them with `useRegistration`. The registration lives while the component is mounted and is cancelled when it unmounts. The second argument lists the values the registration depends on, as in `useEffect`, and the linter checks it the same way. When a value changes, the registration is replaced.',
    registeringLifetimeText2:
      'Hide the Inspector window in the example: its handler is gone, so the button disappears. The lock state lives in the window, and `isChecked` shows it on the toggle outside the window.',
    invocationTargetsTitle: 'Invocation and targets',
    invocationTargetsText:
      '`run`, `isEnabled` and `isChecked` receive the invocation: `source` tells where the command was invoked from (`menu`, `context-menu`, `toolbar`, `hotkey` or `code`), and `target` carries the data of the context menu target.',
    invocationTargetsText2:
      'A command that needs a target declares its type: `defineCommand<SceneObject>(…)`. Such a command can be invoked only from a context menu of the same target type, and it cannot have a shortcut: the compiler rejects both mistakes. A command without a target has `target: undefined` and works everywhere.',
    errorsTitle: 'Errors',
    errorsItem:
      'A second handler for a command id that already has one is an error. In development it throws, in production it is logged and the second handler is ignored. Two windows of the same kind must share one handler.',
    errorsItem2: 'Two different definitions with the same id are an error in the same way.',
    errorsItem3:
      'If `run` returns a promise that rejects, the error is logged with the command id.',
  },
  ru: {
    pageTitle: 'Команды',
    pageDescription:
      'Описания и обработчики команд, точка подключения интеграции и регистрация на время жизни компонента.',
    definitionsHandlersTitle: 'Описания и обработчики',
    definitionsHandlersText:
      'Команда делится на две части. **Описание** — это данные: id, подпись, необязательная иконка и сочетание по умолчанию. `defineCommand` создаёт его один раз на уровне модуля. **Обработчик** — это поведение: `run` и необязательные `isEnabled` и `isChecked`. Обработчик регистрирует тот, кто умеет выполнять команду: интеграция движка при запуске или окно, пока оно открыто.',
    definitionsHandlersText2:
      'Пункты меню и кнопки панели инструментов ссылаются на объект описания, а не на строку id, поэтому опечатка — ошибка компиляции. Команда без зарегистрированного обработчика скрыта везде, где на неё ссылаются.',
    definitionsHandlersItem:
      '`id` уникален в редакторе. Используйте префикс своей части: `scene.save`, `inspector.lock`. Это ещё и ключ для будущего переназначения сочетаний пользователем.',
    definitionsHandlersItem2:
      '`label` — это `MessageRef`, поэтому подписи следуют за языком без перезагрузки.',
    definitionsHandlersItem3:
      "`shortcut` записывается кодами физических клавиш: `{ keys: 'Mod+Shift+KeyS' }`. `Mod` — это Ctrl на Windows и Linux и ⌘ на macOS. Модификаторы идут в порядке `Mod`, `Alt`, `Shift`, и любой другой порядок или неизвестную клавишу компилятор отклоняет.",
    registriesIntegrationTitle: 'Реестры и точка подключения интеграции',
    registriesIntegrationText:
      'Реестры редактора создаёт `createEditorRegistries` в точке входа и передаёт вниз через `RegistriesProvider`, так же как сторы темы и языка. Глобальных реестров нет: тест или пример создаёт свой изолированный набор. Компоненты получают реестры через `useEditorRegistries`.',
    registriesIntegrationText2:
      'Интеграция подключается одной функцией типа `EditorExtension` из `@/state/registries/editorExtension`. Она получает реестры, регистрирует свои элементы и возвращает функцию, которая отменяет их все. Каждый вызов `register` или `handle` возвращает свою функцию отмены; несколько отмен объединяет `combineUnsubscribes` из `@/core/unsubscribe`.',
    availabilityAtTitle: 'Доступность в момент показа',
    availabilityAtText:
      '`isEnabled` и `isChecked` вычисляются, когда команда показывается: когда открывается меню и когда отрисовывается кнопка панели инструментов. Пункт меню и кнопка одной команды читают один обработчик, поэтому гаснут одновременно.',
    availabilityAtText2:
      'Панель инструментов всегда на экране, поэтому ей нужно узнавать, когда меняется состояние движка. Вызовите `commands.refresh()` после такого изменения: каждый компонент, который показывает команду через `useCommandState`, вычислит её заново. Регистрация или удаление обработчика обновляет их сами.',
    availabilityAtText3:
      'В примере интеграция при запуске обрабатывает `scene.save`. Команда доступна, только пока в мок-сцене есть изменения, и кнопка следует за ней.',
    registeringLifetimeTitle: 'Регистрация на время жизни компонента',
    registeringLifetimeText:
      'Окно, которое приносит свои команды, регистрирует их через `useRegistration`. Регистрация живёт, пока компонент смонтирован, и отменяется при размонтировании. Второй аргумент перечисляет значения, от которых зависит регистрация, как у `useEffect`, и линтер проверяет его так же. Когда значение меняется, регистрация заменяется.',
    registeringLifetimeText2:
      'Скройте окно Inspector в примере: его обработчика больше нет, и кнопка пропадает. Состояние блокировки живёт в окне, а `isChecked` показывает его на переключателе вне окна.',
    invocationTargetsTitle: 'Вызов и цели',
    invocationTargetsText:
      '`run`, `isEnabled` и `isChecked` получают вызов: `source` говорит, откуда вызвана команда (`menu`, `context-menu`, `toolbar`, `hotkey` или `code`), а `target` несёт данные цели контекстного меню.',
    invocationTargetsText2:
      'Команда, которой нужна цель, объявляет её тип: `defineCommand<SceneObject>(…)`. Такую команду можно вызвать только из контекстного меню с целью того же типа, и сочетания у неё быть не может: обе ошибки отклоняет компилятор. У команды без цели `target: undefined`, и она работает везде.',
    errorsTitle: 'Ошибки',
    errorsItem:
      'Второй обработчик для id команды, у которой обработчик уже есть, — ошибка. В режиме разработки она бросает исключение, в production записывается в консоль, а второй обработчик игнорируется. Два окна одного вида должны делить один обработчик.',
    errorsItem2: 'Два разных описания с одним id — такая же ошибка.',
    errorsItem3:
      'Если `run` возвращает промис, который отклоняется, ошибка записывается в консоль вместе с id команды.',
  },
});
