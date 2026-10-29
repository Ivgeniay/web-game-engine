import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const vectorFieldPageMessages = defineDocMessages({
  en: {
    pageTitle: 'VectorField',
    pageDescription: 'Several numbers in one row with draggable axis captions.',
    severalNumbersTitle: 'Several numbers in one row',
    severalNumbersText:
      'A vector field shows several numbers side by side, each with an axis caption: position, rotation and scale in a transform. `axes` lists the captions; `VECTOR2_AXES`, `VECTOR3_AXES` and `VECTOR4_AXES` give X, Y, Z and W. The axis letters are not translated, like key names. X, Y and Z carry a colored mark from the `axis-*` tokens; the caption text keeps the text color.',
    severalNumbersText2:
      '`value` is an array with one number per axis, and `onValueChange(value, phase)` receives the whole vector with one component replaced. Every component is a number field and keeps its protocol: typing and Enter commit once, and dragging an axis caption previews and commits once. The owner writes the vector as it is, and an undo stack records one entry per edit of one component.',
    severalNumbersText3:
      'In a property row, pass `id` and `aria-labelledby` from the row: `id` goes to the first component, so a click on the row caption focuses X, and screen readers read every component as "Position X". Without a row, name the field with `aria-label`. Every component is its own Tab stop, from left to right.',
    integersOwnTitle: 'Integers and own axes',
    integersOwnText:
      '`kind`, `min`, `max`, `step`, `precision` and `invalidMessages` work as in the number field and apply to all components. Axes may have any captions and may go without a mark, as U and V of a texture tiling below.',
    mixedComponentsTitle: 'Mixed components',
    mixedComponentsText:
      '`mixed` is an array of flags, one per component: several selected objects may share Y and differ in X and Z. A mixed component shows a dash and is edited like any other; the owner decides when it stops being mixed.',
    otherPropsTitle: 'Other props',
    otherPropsText:
      '`disabled` and `readOnly` apply to all components and turn off dragging. `infiniteDrag` locks the pointer while an axis caption is dragged, as `infinite` in value drag. `size` sets the height of the fields, and `className` goes to the outer element for layout. Linking proportions of the components, as the scale lock in Godot and Unreal, is not supported yet.',
  },
  ru: {
    pageTitle: 'VectorField',
    pageDescription:
      'Несколько чисел в одной строке с подписями осей, которые можно перетаскивать.',
    severalNumbersTitle: 'Несколько чисел в одной строке',
    severalNumbersText:
      'Поле вектора показывает несколько чисел рядом, у каждого — подпись оси: позиция, поворот и масштаб в трансформации. `axes` перечисляет подписи; `VECTOR2_AXES`, `VECTOR3_AXES` и `VECTOR4_AXES` дают X, Y, Z и W. Буквы осей не переводятся, как названия клавиш. У X, Y и Z есть цветная метка из токенов `axis-*`; текст подписи остаётся цветом текста.',
    severalNumbersText2:
      '`value` — массив с одним числом на ось, а `onValueChange(value, phase)` получает весь вектор с заменённой компонентой. Каждая компонента — числовое поле со своим протоколом: ввод и Enter фиксируют один раз, перетаскивание подписи оси даёт предпросмотр и одну фиксацию. Владелец записывает вектор как есть, а стек отмены получает одну запись на правку одной компоненты.',
    severalNumbersText3:
      'В строке свойства передайте `id` и `aria-labelledby` из строки: `id` уходит первой компоненте, поэтому клик по подписи строки переводит фокус в X, а скринридеры читают каждую компоненту как «Position X». Без строки назовите поле через `aria-label`. Каждая компонента — своя остановка Tab, слева направо.',
    integersOwnTitle: 'Целые числа и свои оси',
    integersOwnText:
      '`kind`, `min`, `max`, `step`, `precision` и `invalidMessages` работают как у числового поля и действуют на все компоненты. Подписи осей могут быть любыми и без метки, как U и V у повтора текстуры ниже.',
    mixedComponentsTitle: 'Смешанные компоненты',
    mixedComponentsText:
      '`mixed` — массив флагов, по одному на компоненту: у нескольких выбранных объектов Y может совпадать, а X и Z различаться. Смешанная компонента показывает черту и редактируется как обычная; когда она перестаёт быть смешанной, решает владелец.',
    otherPropsTitle: 'Остальные пропсы',
    otherPropsText:
      '`disabled` и `readOnly` действуют на все компоненты и выключают перетаскивание. `infiniteDrag` блокирует указатель, пока тянут подпись оси, как `infinite` у перетаскивания значения. `size` задаёт высоту полей, а `className` уходит на внешний элемент для раскладки. Связь пропорций компонент, как замок масштаба в Godot и Unreal, пока не поддерживается.',
  },
});
