import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const contextMenuPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Context menu',
    pageDescription:
      'Menus assembled for a context and its target, opened by right click, Shift+F10 or the menu key.',
    contextsTitle: 'Contexts',
    contextsText:
      "A context menu is assembled from the registry by a context: an id plus the type of its target. `defineContextMenu<SceneObject>({ id: 'hierarchy.item', label })` declares the context once next to the code that shows it. The label is the accessible name of the menu.",
    contextsText2:
      '`contextMenus.registerItem(context, item)` and `contextMenus.registerMenu(context, menu)` take the same paths, groups and orders as the main menu, except that commands may sit at the root. Anyone can add items to any context, including the contexts of the framework: the lighting extension in the example adds Bake lighting to the objects of the hierarchy.',
    targetsTitle: 'Targets',
    targetsText:
      'The item passes the target of the menu to its command. A command of the context target type, `defineCommand<SceneObject>`, receives the object in `invocation.target`, and its `isEnabled` can depend on it. A command without a target, such as Paste, is added with `withoutTarget: true` and receives `undefined`. The compiler rejects a command of another target type and a command without a target that is not marked.',
    openingTitle: 'Opening',
    openingText:
      '`useContextMenu(context)` returns the state of one menu. `getTriggerProps(target)` gives the handlers for each element with that target, and `ContextMenu` draws the open menu. One menu serves a whole list.',
    openingItem:
      'The menu opens on a right click at the pointer, and on Shift+F10 or the context menu key below the focused element.',
    openingItem2:
      'The innermost element wins: a row inside a panel opens the row menu, the empty space of the panel opens the panel menu.',
    openingItem3:
      'Text fields keep the native menu of the browser with copy and paste. Elsewhere in the editor `startNativeContextMenuSuppression(document)` in the entry point suppresses the native menu, even where no context menu is registered.',
    openingItem4: 'A context without visible items opens nothing.',
    itemsComponentTitle: 'Items for a component',
    itemsComponentText:
      'A primitive with its own menu, such as `ComponentHeader`, takes ready `MenuItem` values and knows nothing about registries. `useContextMenuItems(context, target)` builds those items from the registry the same way `ContextMenu` does: hidden commands are left out, groups are separated, `isEnabled` and `isChecked` are asked about the target, and a command runs after the menu has closed. The items follow new registrations and `commands.refresh()`. Keep the target stable with `useMemo`.',
  },
  ru: {
    pageTitle: 'Контекстное меню',
    pageDescription:
      'Меню, собранное для контекста и его цели; открывается правым кликом, Shift+F10 или клавишей меню.',
    contextsTitle: 'Контексты',
    contextsText:
      "Контекстное меню собирается из реестра по контексту: id плюс тип его цели. `defineContextMenu<SceneObject>({ id: 'hierarchy.item', label })` объявляет контекст один раз рядом с кодом, который его показывает. Подпись — доступное имя меню.",
    contextsText2:
      '`contextMenus.registerItem(context, item)` и `contextMenus.registerMenu(context, menu)` принимают те же пути, группы и порядок, что и главное меню, только команды могут лежать в корне. Добавлять пункты в любой контекст может кто угодно, включая контексты каркаса: расширение освещения в примере добавляет Bake lighting к объектам иерархии.',
    targetsTitle: 'Цели',
    targetsText:
      'Пункт передаёт своей команде цель меню. Команда с типом цели контекста, `defineCommand<SceneObject>`, получает объект в `invocation.target`, и её `isEnabled` может от него зависеть. Команда без цели, например Paste, добавляется с `withoutTarget: true` и получает `undefined`. Команду с другим типом цели и команду без цели без такой пометки компилятор отклоняет.',
    openingTitle: 'Открытие',
    openingText:
      '`useContextMenu(context)` возвращает состояние одного меню. `getTriggerProps(target)` даёт обработчики для каждого элемента с этой целью, а `ContextMenu` рисует открытое меню. Одно меню обслуживает весь список.',
    openingItem:
      'Меню открывается правым кликом у указателя, а по Shift+F10 или клавише контекстного меню — под элементом с фокусом.',
    openingItem2:
      'Побеждает самый вложенный элемент: строка внутри панели открывает меню строки, пустое место панели — меню панели.',
    openingItem3:
      'Текстовые поля оставляют родное меню браузера с копированием и вставкой. В остальном редакторе `startNativeContextMenuSuppression(document)` в точке входа подавляет родное меню, даже там, где контекстное меню не зарегистрировано.',
    openingItem4: 'Контекст без видимых пунктов ничего не открывает.',
    itemsComponentTitle: 'Пункты для компонента',
    itemsComponentText:
      'Примитив со своим меню, например `ComponentHeader`, принимает готовые значения `MenuItem` и ничего не знает о реестрах. `useContextMenuItems(context, target)` строит эти пункты из реестра так же, как `ContextMenu`: скрытые команды пропускаются, группы разделяются, `isEnabled` и `isChecked` спрашиваются о цели, а команда выполняется после закрытия меню. Пункты следуют за новыми регистрациями и `commands.refresh()`. Держите цель стабильной через `useMemo`.',
  },
});
