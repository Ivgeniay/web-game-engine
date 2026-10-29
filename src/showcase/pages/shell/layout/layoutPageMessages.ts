import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const layoutPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Layout',
    pageDescription:
      'The default layout of the integration, saving and restoring the layout, and resetting it.',
    defaultLayoutTitle: 'Default layout',
    defaultLayoutText:
      'The integration describes its default layout as data and hands it to `workspace.setDefaultLayout(layout)` at startup, next to the registration of its windows. The call returns its cancellation. Without a default layout the workspace starts empty.',
    defaultLayoutItem:
      '`tabsLayout([sceneWindow, gameWindow], { activeWindow?, weight? })` is a group of tabs. The first window is active unless `activeWindow` says otherwise.',
    defaultLayoutItem2:
      "`splitLayout('row' | 'column', children, { weight? })` places its children side by side or one under another. A nested split of the same direction is merged into its parent.",
    defaultLayoutItem3:
      '`weight` is the share of a child among its siblings, 1 by default. Weights 1, 3 and 1 give the middle group three fifths of the row.',
    savingRestoringTitle: 'Saving and restoring',
    savingRestoringText:
      '`DockLayout` takes a `layoutStorage`, created with `createLayoutStorage(browserStorage, key)`. The key is chosen by the entry point, and every application on the same address has its own key: the editor uses `editor-layout`, the demo scene `demo-layout`, the example below a key of its own. Otherwise one application would restore, and then overwrite, the layout of another one with windows it does not know. The theme and the language, on the contrary, are shared by all applications on the same address on purpose. Without a storage the layout lives only until the page is reloaded.',
    savingRestoringItem:
      'The layout is saved half a second after the last change and at once when the page is hidden or `DockLayout` unmounts.',
    savingRestoringItem2:
      'The stored value is `{ version: 1, current }`, where `current` is the serialized dockview layout. Named layouts will sit next to it in the same value.',
    savingRestoringItem3:
      'Windows whose type is no longer registered are skipped on restore, the rest of the layout stays. If nothing is left, or the stored value is broken or of another version, the default layout is applied and the editor keeps working.',
    savingRestoringItem4:
      'Window types and the default layout must be registered before `DockLayout` mounts: the layout is restored once, when the dock is ready.',
    resetTitle: 'Reset',
    resetText:
      'The framework command `resetLayoutCommand` asks for confirmation and brings the default layout back. The framework does not put it anywhere: the integration adds it to its menu, usually under Window. The command is disabled while there is no default layout.',
  },
  ru: {
    pageTitle: 'Раскладка',
    pageDescription:
      'Раскладка интеграции по умолчанию, сохранение и восстановление раскладки и её сброс.',
    defaultLayoutTitle: 'Раскладка по умолчанию',
    defaultLayoutText:
      'Интеграция описывает раскладку по умолчанию данными и передаёт её в `workspace.setDefaultLayout(layout)` при запуске, рядом с регистрацией своих окон. Вызов возвращает свою отмену. Без раскладки по умолчанию рабочая область начинается пустой.',
    defaultLayoutItem:
      '`tabsLayout([sceneWindow, gameWindow], { activeWindow?, weight? })` — группа вкладок. Активно первое окно, если `activeWindow` не говорит иначе.',
    defaultLayoutItem2:
      "`splitLayout('row' | 'column', children, { weight? })` ставит детей рядом или друг под другом. Вложенное разделение того же направления сливается с родителем.",
    defaultLayoutItem3:
      '`weight` — доля ребёнка среди соседей, по умолчанию 1. Веса 1, 3 и 1 дают средней группе три пятых ряда.',
    savingRestoringTitle: 'Сохранение и восстановление',
    savingRestoringText:
      '`DockLayout` принимает `layoutStorage`, созданное через `createLayoutStorage(browserStorage, key)`. Ключ выбирает точка входа, и у каждого приложения на одном адресе свой ключ: у редактора `editor-layout`, у демо-сцены `demo-layout`, у примера ниже — свой. Иначе одно приложение восстановило бы, а потом перезаписало раскладку другого с окнами, которых оно не знает. Тема и язык, наоборот, общие для всех приложений на одном адресе намеренно. Без хранилища раскладка живёт только до перезагрузки страницы.',
    savingRestoringItem:
      'Раскладка сохраняется через полсекунды после последнего изменения и сразу, когда страница скрывается или `DockLayout` размонтируется.',
    savingRestoringItem2:
      'Хранимое значение — `{ version: 1, current }`, где `current` — сериализованная раскладка dockview. Именованные раскладки встанут рядом в том же значении.',
    savingRestoringItem3:
      'Окна, тип которых больше не зарегистрирован, при восстановлении пропускаются, остальная раскладка остаётся. Если не осталось ничего или хранимое значение повреждено или другой версии, применяется раскладка по умолчанию, и редактор продолжает работать.',
    savingRestoringItem4:
      'Типы окон и раскладку по умолчанию нужно зарегистрировать до монтирования `DockLayout`: раскладка восстанавливается один раз, когда докинг готов.',
    resetTitle: 'Сброс',
    resetText:
      'Команда каркаса `resetLayoutCommand` просит подтверждения и возвращает раскладку по умолчанию. Каркас её никуда не ставит: интеграция добавляет её в своё меню, обычно в Window. Команда отключена, пока раскладки по умолчанию нет.',
  },
});
