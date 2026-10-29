import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const demoScenePageMessages = defineDocMessages({
  en: {
    pageTitle: 'Demo scene',
    pageDescription:
      'The demonstration integration in `src/demo`: every extension point together in a Unity-style editor.',
    whatIsTitle: 'What it is',
    whatIsText:
      'The demo scene is a demonstration integration: it puts every extension point of the framework together and looks like a Unity-style editor. It is a sample for engine developers and a check that the mechanisms work together, not only one by one. Like the showcase, it exists only in `pnpm dev` and is not part of the build.',
    whatIsItem: 'Scene and Game with placeholder content.',
    whatIsItem2:
      'Hierarchy shows the objects of the scene as a tree. It selects one or several objects, renames them with F2 (Enter on macOS) or a double click, changes their parent and order by dragging, and duplicates, renames and deletes them from the context menu.',
    whatIsItem3:
      'Inspector shows the objects selected in the hierarchy: the name, the Transform and the components that all of them share, each under a `ComponentHeader` with a collapse arrow, an enable checkbox on Rigidbody and Light and a menu with Reset and Remove component. With several objects, different values show as mixed, and a change goes to all of them.',
    whatIsItem4: 'Project shows the folders and files of a demo project as a tree with a search.',
    whatIsItem5:
      'Every change goes into the undo stack as one record: edits in the inspector, also for several objects at once, creating, duplicating, renaming, moving and deleting objects. Undo and Redo are in the Edit menu, on Mod+Z and Mod+Shift+Z.',
    whatIsItem6: 'Menus File, Edit, GameObject and Window.',
    whatIsItem7:
      'Tools Move, Rotate and Scale on the left of the toolbar, Play, Pause and Step in the middle.',
    whatIsItem8: 'The play mode in the status bar.',
    whatIsItem9: 'The classic Unity layout by default.',
    whereLivesTitle: 'Where it lives',
    whereLivesText:
      'The demo lives in `src/demo/`, next to `src/engine/`, where the integration of a real engine goes. It is written the way an engine developer would write an integration: it imports the framework through `@/` and extends it through registries only. The framework never imports `src/demo/` or `src/engine/`; the linter checks it. The showcase may read the demo only as source text with `?raw`, as on this page.',
    whereLivesItem:
      '`demo.html` and `src/demo/main.tsx` are the entry point. It repeats `src/app/main.tsx`, adds the stores of the demo and installs the demo integration. The layout is stored under its own key `demo-layout`.',
    whereLivesItem2:
      '`demoExtension.ts` is the integration itself: one `EditorExtension` made of smaller registrations.',
    whereLivesItem3:
      '`windows/` holds the windows, `playMode/` and `scene/` the mock state with its commands, `icons/` the icon set of the demo.',
    entryPointTitle: 'Entry point',
    integrationTitle: 'The integration',
    windowsTitle: 'Windows',
    windowsText:
      'The window types are data. Their registration also places the items that belong to the windows: Show grid in the tab menu of Scene and the context menu of the hierarchy. The items appear only while a window that handles their commands is open.',
    windowsText2:
      'A window is an ordinary component. Scene brings the handlers of its commands for its lifetime with `useRegistration`: Frame selected works with F only while the focus is inside the Scene window, Show grid toggles from the tab menu.',
    windowsText3:
      'Hierarchy builds a `TreeModel` from the objects of the scene store, keeps the selection in the store so that the inspector follows it, and keeps the expanded rows, the focused row and the renamed row in the window. Renaming and dropping go through `applySceneEdit`, which puts the change into the undo stack with a snapshot of the objects and the selection.',
    defaultLayoutTitle: 'Default layout',
    whatIsLink: 'Open the demo scene',
  },
  ru: {
    pageTitle: 'Демо-сцена',
    pageDescription:
      'Демонстрационная интеграция из `src/demo`: все точки расширения вместе в редакторе в стиле Unity.',
    whatIsTitle: 'Что это',
    whatIsText:
      'Демо-сцена — демонстрационная интеграция: она собирает вместе все точки расширения каркаса и выглядит как редактор в стиле Unity. Это образец для разработчиков движков и проверка, что механизмы работают вместе, а не только по отдельности. Как и витрина, она есть только в `pnpm dev` и не входит в сборку.',
    whatIsItem: 'Scene и Game с содержимым-заглушкой.',
    whatIsItem2:
      'Hierarchy показывает объекты сцены деревом. Она выделяет один или несколько объектов, переименовывает их по F2 (Enter на macOS) или двойному клику, меняет родителя и порядок перетаскиванием, а дублирует, переименовывает и удаляет из контекстного меню.',
    whatIsItem3:
      'Inspector показывает объекты, выделенные в иерархии: имя, Transform и компоненты, общие для всех них, каждый под `ComponentHeader` со стрелкой сворачивания, флажком включения у Rigidbody и Light и меню с Reset и Remove component. При нескольких объектах разные значения показываются как смешанные, а изменение уходит всем.',
    whatIsItem4: 'Project показывает папки и файлы демо-проекта деревом с поиском.',
    whatIsItem5:
      'Каждое изменение попадает в стек отмены одной записью: правки в инспекторе, в том числе сразу для нескольких объектов, создание, дублирование, переименование, перемещение и удаление объектов. Undo и Redo — в меню Edit, на Mod+Z и Mod+Shift+Z.',
    whatIsItem6: 'Меню File, Edit, GameObject и Window.',
    whatIsItem7:
      'Инструменты Move, Rotate и Scale слева на панели инструментов, Play, Pause и Step — посередине.',
    whatIsItem8: 'Режим игры в строке состояния.',
    whatIsItem9: 'Классическая раскладка Unity по умолчанию.',
    whereLivesTitle: 'Где она живёт',
    whereLivesText:
      'Демо живёт в `src/demo/`, рядом с `src/engine/`, где располагается интеграция настоящего движка. Оно написано так, как разработчик движка написал бы интеграцию: импортирует каркас через `@/` и расширяет его только через реестры. Каркас никогда не импортирует `src/demo/` и `src/engine/`, это проверяет линтер. Витрина может читать демо только как исходный текст через `?raw`, как на этой странице.',
    whereLivesItem:
      '`demo.html` и `src/demo/main.tsx` — точка входа. Она повторяет `src/app/main.tsx`, добавляет сторы демо и подключает демо-интеграцию. Раскладка хранится под своим ключом `demo-layout`.',
    whereLivesItem2:
      '`demoExtension.ts` — сама интеграция: один `EditorExtension` из регистраций поменьше.',
    whereLivesItem3:
      'В `windows/` лежат окна, в `playMode/` и `scene/` — мок-состояние с его командами, в `icons/` — набор иконок демо.',
    entryPointTitle: 'Точка входа',
    integrationTitle: 'Интеграция',
    windowsTitle: 'Окна',
    windowsText:
      'Типы окон — это данные. Их регистрация заодно ставит пункты, которые принадлежат окнам: Show grid в меню вкладки Scene и контекстное меню иерархии. Пункты появляются, только пока открыто окно, которое обрабатывает их команды.',
    windowsText2:
      'Окно — обычный компонент. Scene приносит обработчики своих команд на время жизни через `useRegistration`: Frame selected работает по F, только пока фокус внутри окна Scene, Show grid переключается из меню вкладки.',
    windowsText3:
      'Hierarchy строит `TreeModel` из объектов стора сцены, хранит выделение в сторе, чтобы за ним следовал инспектор, а развёрнутые строки, строку с фокусом и переименуемую строку держит в окне. Переименование и перенос идут через `applySceneEdit`, который кладёт изменение в стек отмены вместе со снимком объектов и выделения.',
    defaultLayoutTitle: 'Раскладка по умолчанию',
    whatIsLink: 'Открыть демо-сцену',
  },
});
