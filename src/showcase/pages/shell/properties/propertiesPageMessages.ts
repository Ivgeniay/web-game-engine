import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const propertiesPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Property descriptions',
    pageDescription:
      'Properties of engine objects described as data, editors chosen by value type and own editors of the integration.',
    describingTitle: 'Describing properties',
    describingText:
      'The integration describes a property of its objects as data, and the framework picks the field for it. A description is a `PropertyDescription` from `@/contracts/property`: the value type in `type`, an `id`, a `label` (a `MessageRef`), and `read(targetId)` and `write(targetId, value)`. The framework does not know how engine objects are built: it only passes the ids of the targets, and the integration reads and writes the values itself.',
    describingText2:
      'Descriptions are made by typed constructors from `@/core/inspector/properties`: `numberProperty`, `stringProperty`, `booleanProperty`, `vectorProperty`, `colorProperty`, `enumProperty`, `flagsProperty`, `rectProperty`, `boundsProperty`, `listProperty` and `customProperty`. They check `read` and `write` against the value type: an enumeration takes its values from the options, a list takes its item type from `createItem`.',
    describingText3:
      'Common fields: `readOnly` shows the field but does not let it be changed, `hidden` does not show the property, `defaultValue` is the value the property is reset to. Display attributes depend on the type:',
    describingItem:
      '`number`: `kind` (`integer` or `float`), `min`, `max`, `step`; `slider: true` shows a [Slider](components/slider) and requires `min` and `max`.',
    describingItem2:
      '`string`: `multiline: true` shows a [TextArea](components/text-area) instead of a [TextField](components/text-field).',
    describingItem3:
      '`vector`: `dimensions` from 2 to 4, `kind`, `min`, `max`, `step`; `color`: `showAlpha`; `rect` and `bounds`: `kind`.',
    describingItem4:
      '`enum` and `flags`: `options` with a value and a `label`. A [Select](components/select) and a [FlagsField](components/flags-field) show them.',
    fieldTitle: 'Property field',
    fieldText:
      '`PropertyField` from `@/inspector/PropertyField` draws one property for the targets in `targetIds` as a [PropertyRow](components/property-row) with the field of its type. Put the rows into a `PropertyRowGroup`. The field reads the values while it is drawn, so redraw it when the data of the engine changes.',
    fieldText2:
      'With several targets the field shows the first value, and a mixed value as a dash. A change goes to every target and makes one undo entry for all of them in the `undo` stack of the registries: a preview writes the values, a commit records the entry, a cancel writes the start values back. Vectors, rectangles, bounds and flags change only the touched components, the others keep their own value on every target. Change the position of the two bodies below and undo it.',
    listsTitle: 'Lists',
    listsText:
      '`listProperty` shows a [ListEditor](components/list-editor). `item` describes an element: its type and display attributes, as in a property, and `read(item)` and `write(item, value)`, which take the value out of an element and put it back. So an element may be a structure of the engine with its own id, for example a waypoint `{ id, position }` edited as a vector. `createItem` makes a new element, `copyItem` a copy when the size grows, `getItemKey` gives a stable key; without it the key is the index.',
    customTitle: 'Own value types',
    customText:
      'A value type of the engine that the framework does not know gets its own editor. `definePropertyType<T>({ id, equals? })` declares the type, with the prefix of its part in the `id`. `propertyEditors.register(type, Editor)` registers the editor in the registries, and `customProperty({ valueType, … })` describes a property of that type. The integration registers its editors at startup, before the properties are shown. The framework types cannot be registered, they are not `PropertyType` values.',
    customText2:
      'The editor gets `PropertyEditorProps<T>`: the translated `label`, `value` and `values` of the targets, `mixed`, `readOnly`, `onValueChange` for one value for every target and `onTargetsChange` for a change that depends on the own value of every target. It draws the whole row itself. In the example, a layer of the engine is stored as an index and shown with the names of the layers.',
  },
  ru: {
    pageTitle: 'Описание свойств',
    pageDescription:
      'Свойства объектов движка, описанные данными, редакторы по типу значения и собственные редакторы интеграции.',
    describingTitle: 'Описание свойств',
    describingText:
      'Интеграция описывает свойство своих объектов данными, а поле для него выбирает каркас. Описание — это `PropertyDescription` из `@/contracts/property`: тип значения в `type`, `id`, подпись `label` (это `MessageRef`), а также `read(targetId)` и `write(targetId, value)`. Каркас не знает, как устроены объекты движка: он передаёт только id целей, а читает и записывает значения сама интеграция.',
    describingText2:
      'Описания создают типизированные конструкторы из `@/core/inspector/properties`: `numberProperty`, `stringProperty`, `booleanProperty`, `vectorProperty`, `colorProperty`, `enumProperty`, `flagsProperty`, `rectProperty`, `boundsProperty`, `listProperty` и `customProperty`. Они сверяют `read` и `write` с типом значения: перечисление берёт свои значения из вариантов, список — тип элемента из `createItem`.',
    describingText3:
      'Общие поля: `readOnly` показывает поле, но не даёт его менять, `hidden` не показывает свойство, `defaultValue` — значение, к которому свойство сбрасывается. Атрибуты отображения зависят от типа:',
    describingItem:
      '`number`: `kind` (`integer` или `float`), `min`, `max`, `step`; `slider: true` показывает [Slider](components/slider) и требует `min` и `max`.',
    describingItem2:
      '`string`: `multiline: true` показывает [TextArea](components/text-area) вместо [TextField](components/text-field).',
    describingItem3:
      '`vector`: `dimensions` от 2 до 4, `kind`, `min`, `max`, `step`; `color`: `showAlpha`; `rect` и `bounds`: `kind`.',
    describingItem4:
      '`enum` и `flags`: варианты `options` со значением и подписью `label`. Их показывают [Select](components/select) и [FlagsField](components/flags-field).',
    fieldTitle: 'Поле свойства',
    fieldText:
      '`PropertyField` из `@/inspector/PropertyField` рисует одно свойство для целей из `targetIds` строкой [PropertyRow](components/property-row) с полем его типа. Строки кладите в `PropertyRowGroup`. Поле читает значения при отрисовке, поэтому перерисовывайте его, когда меняются данные движка.',
    fieldText2:
      'При нескольких целях поле показывает первое значение, а смешанное — прочерком. Изменение уходит всем целям и создаёт одну запись отмены для всех в стеке `undo` из реестров: предпросмотр записывает значения, фиксация создаёт запись, отмена возвращает начальные значения. Векторы, прямоугольники, объёмы и флаги меняют только тронутые компоненты, остальные сохраняют у каждой цели своё значение. Измените позицию двух тел ниже и отмените изменение.',
    listsTitle: 'Списки',
    listsText:
      '`listProperty` показывает [ListEditor](components/list-editor). `item` описывает элемент: его тип и атрибуты отображения, как у свойства, а также `read(item)` и `write(item, value)`, которые достают значение из элемента и кладут его обратно. Поэтому элементом может быть структура движка со своим id, например точка пути `{ id, position }`, которая редактируется как вектор. `createItem` создаёт новый элемент, `copyItem` — копию при увеличении размера, `getItemKey` даёт устойчивый ключ; без него ключ — индекс.',
    customTitle: 'Свои типы значений',
    customText:
      'Тип значения движка, которого каркас не знает, получает свой редактор. `definePropertyType<T>({ id, equals? })` объявляет тип, в `id` — префикс своей части. `propertyEditors.register(type, Editor)` регистрирует редактор в реестрах, а `customProperty({ valueType, … })` описывает свойство этого типа. Интеграция регистрирует свои редакторы при старте, до показа свойств. Типы каркаса зарегистрировать нельзя: они не значения `PropertyType`.',
    customText2:
      'Редактор получает `PropertyEditorProps<T>`: переведённую подпись `label`, `value` и `values` целей, `mixed`, `readOnly`, `onValueChange` для одного значения всем целям и `onTargetsChange` для изменения, которое зависит от собственного значения каждой цели. Всю строку он рисует сам. В примере слой движка хранится индексом и показывается именами слоёв.',
  },
});
