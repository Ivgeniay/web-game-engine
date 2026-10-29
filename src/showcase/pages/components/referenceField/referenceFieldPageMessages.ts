import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const referenceFieldPageMessages = defineDocMessages({
  en: {
    pageTitle: 'ReferenceField',
    pageDescription:
      'A reference to an object or an asset: its icon and name, the picker, clearing and dropping.',
    referenceTitle: 'A reference field',
    referenceText:
      "`ReferenceField` is the analog of `ObjectField` in Unity. Its `value` is the id of the target or `null`; `getLabel` and `getIcon` give its name and icon, `labels.none` is shown without a target and a dash when `mixed`. The field is one button: a click or Enter calls `onOpenPicker`, and the owner opens a [PickerDialog](components/picker-dialog). Delete, Backspace or the clear button set `null` with `'commit'`.",
    referenceText2:
      'The field accepts dropped data of the types in `dropTypes` (see [Drag and drop](components/drag-and-drop)); `resolveDrop(data)` turns the data into the id of a target, or returns `null` to refuse it. Drag the chip below onto the field. `readOnly` shows the reference but does not change it, `disabled` turns the field off. The labels are translated by `useReferenceFieldLabels` from `@/state/fields`.',
    inspectorTitle: 'In the inspector',
    inspectorText:
      'An integration usually does not draw the field itself: a property made with `referenceProperty` gets a reference field and a picker from the [Inspector](shell/inspector). Its `provider` is a `ReferenceProvider` from `@/contracts/property`: the picker tabs with `getItemIds`, `getLabel`, `getIcon`, `loadThumbnail`, `dragTypes` and `resolveDrop`.',
  },
  ru: {
    pageTitle: 'ReferenceField',
    pageDescription:
      'Ссылка на объект или ассет: его иконка и имя, окно выбора, очистка и перетаскивание.',
    referenceTitle: 'Поле ссылки',
    referenceText:
      "`ReferenceField` — аналог `ObjectField` в Unity. Его `value` — id цели или `null`; `getLabel` и `getIcon` дают её имя и иконку, `labels.none` видно без цели, а при `mixed` — прочерк. Поле — одна кнопка: клик или Enter вызывает `onOpenPicker`, и владелец открывает [PickerDialog](components/picker-dialog). Delete, Backspace или кнопка очистки задают `null` с `'commit'`.",
    referenceText2:
      'Поле принимает перетаскиваемые данные типов из `dropTypes` (см. [Перенос данных](components/drag-and-drop)); `resolveDrop(data)` превращает данные в id цели или возвращает `null`, чтобы отказаться. Перетащите плашку ниже на поле. `readOnly` показывает ссылку, но не меняет её, `disabled` отключает поле. Подписи переводит `useReferenceFieldLabels` из `@/state/fields`.',
    inspectorTitle: 'В инспекторе',
    inspectorText:
      'Обычно интеграция не рисует поле сама: свойство, созданное `referenceProperty`, получает поле ссылки и окно выбора от [Инспектора](shell/inspector). Его `provider` — `ReferenceProvider` из `@/contracts/property`: вкладки окна выбора с `getItemIds`, `getLabel`, `getIcon`, `loadThumbnail`, `dragTypes` и `resolveDrop`.',
  },
});
