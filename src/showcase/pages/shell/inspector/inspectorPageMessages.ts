import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const inspectorPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Inspector',
    pageDescription:
      'Sections of the selected objects built from data, groups, default values and own section editors.',
    sourceTitle: 'Sections from a source',
    sourceText:
      '`Inspector` from `@/inspector/Inspector` draws the editor of the targets in `targetIds`. The integration gives it an `InspectorSource` from `@/contracts/inspector`: `getSections(targetIds)` returns the sections that every target has, and `subscribe(listener)` reports that the data of the engine changed, so the inspector redraws. Without targets the inspector draws nothing; the window shows its own hint.',
    sourceText2:
      'An `InspectorSection` is data: an `id` that stays the same for other targets, a `type` for its renderer, a `title` (a `MessageRef`), an optional `icon` and `items`. Each section is drawn with a [ComponentHeader](components/component-header) and the rows of its [properties](shell/properties). The inspector keeps which sections are collapsed by `id` while it lives, so a collapsed component stays collapsed when the selection changes.',
    sourceItem:
      '`enabled` with `read` and `write` adds the checkbox to the header; with several targets it shows a mixed state and changes every target as one undo entry.',
    sourceItem2:
      "An item `{ type: 'group', id, label, properties }` draws a [SectionHeader](components/section-header) with its properties under it.",
    sourceItem3:
      'The section menu comes from the registry: the integration registers items in the context `inspectorSectionMenu` from `@/inspector/inspectorMenus`. The target of a command is `{ section, targetIds }`.',
    defaultsTitle: 'Default values',
    defaultsText:
      'A property with `defaultValue` gets a mark at the left edge of its row while any target differs from the default, and a reset button right of the field. The property menu gets the item Reset. Both write the default to every target as one undo entry. The integration adds its own items to the property menu in the context `inspectorPropertyMenu` with the target `{ property, targetIds }`; Reset goes after them. A read-only property shows the mark but cannot be reset. Lists and bounds draw their own rows and have no mark yet.',
    defaultsText2:
      'In the example two lamps are selected: the intensity differs from the default on one of them, and the light is off on the other one, so the checkbox is mixed.',
    customTitle: 'Own section editor',
    customText:
      'A section can be drawn completely by the integration, like a custom editor in Unity. Register a component for the section type: `inspectorSections.register({ type, component })`. It gets `InspectorSectionProps`: `section`, `targetIds`, `expanded` and `onExpandedChange`. `InspectorSectionFrame` draws the usual header with the checkbox and the menu, and `InspectorItems` draws the rows of the items, so a section may keep them and add its own controls, or draw something else entirely.',
  },
  ru: {
    pageTitle: 'Инспектор',
    pageDescription:
      'Секции выделенных объектов, построенные по данным, группы, значения по умолчанию и собственная отрисовка секций.',
    sourceTitle: 'Секции из источника',
    sourceText:
      '`Inspector` из `@/inspector/Inspector` рисует редактор целей из `targetIds`. Интеграция передаёт ему `InspectorSource` из `@/contracts/inspector`: `getSections(targetIds)` возвращает секции, которые есть у всех целей, а `subscribe(listener)` сообщает, что данные движка изменились, и инспектор перерисовывается. Без целей инспектор ничего не рисует; подсказку показывает само окно.',
    sourceText2:
      '`InspectorSection` — данные: `id`, который не меняется у других целей, `type` для отрисовщика, заголовок `title` (это `MessageRef`), необязательная `icon` и элементы `items`. Каждая секция рисуется заголовком [ComponentHeader](components/component-header) и строками своих [свойств](shell/properties). Инспектор помнит свёрнутые секции по `id`, пока он жив, поэтому свёрнутый компонент остаётся свёрнутым при смене выделения.',
    sourceItem:
      '`enabled` с `read` и `write` добавляет в заголовок флажок; при нескольких целях он показывает смешанное состояние и меняет все цели одной записью отмены.',
    sourceItem2:
      "Элемент `{ type: 'group', id, label, properties }` рисует [SectionHeader](components/section-header) со свойствами под ним.",
    sourceItem3:
      'Меню секции приходит из реестра: интеграция регистрирует пункты в контексте `inspectorSectionMenu` из `@/inspector/inspectorMenus`. Цель команды — `{ section, targetIds }`.',
    defaultsTitle: 'Значения по умолчанию',
    defaultsText:
      'У свойства с `defaultValue`, пока у какой-нибудь цели значение отличается от значения по умолчанию, у левого края строки появляется отметка, а справа от поля — кнопка сброса. В меню свойства появляется пункт «Сбросить». Оба записывают значение по умолчанию во все цели одной записью отмены. Свои пункты в меню свойства интеграция добавляет в контексте `inspectorPropertyMenu` с целью `{ property, targetIds }`; «Сбросить» идёт после них. Свойство только для чтения показывает отметку, но не сбрасывается. Списки и объёмы рисуют свои строки сами и отметки пока не имеют.',
    defaultsText2:
      'В примере выбраны две лампы: у одной интенсивность отличается от значения по умолчанию, у другой выключен свет, поэтому флажок смешанный.',
    customTitle: 'Своя отрисовка секции',
    customText:
      'Секцию может целиком нарисовать интеграция, как пользовательский редактор в Unity. Зарегистрируйте компонент для типа секции: `inspectorSections.register({ type, component })`. Он получает `InspectorSectionProps`: `section`, `targetIds`, `expanded` и `onExpandedChange`. `InspectorSectionFrame` рисует обычный заголовок с флажком и меню, а `InspectorItems` — строки элементов, поэтому секция может оставить их и добавить свои элементы управления или нарисовать что-то совсем другое.',
  },
});
