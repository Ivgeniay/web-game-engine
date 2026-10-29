import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const checkboxPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Checkbox',
    pageDescription: 'A box that switches a boolean value, with a mixed state for partial values.',
    checkedStateTitle: 'Checked state and label',
    checkedStateText:
      'A checkbox switches a boolean value. The state is controlled: `checked` sets it, and `onCheckedChange` receives the requested new value. It is a native `input type="checkbox"`, drawn with tokens.',
    checkedStateText2:
      '`label` shows a text to the right of the box, and clicking the text switches the checkbox too. Without a visible label, name the checkbox with `aria-label` or point to a caption with `aria-labelledby`: one of the three is required by the types. A label on the left comes from the property row around the field.',
    mixedStateTitle: 'Mixed state',
    mixedStateText:
      '`checked="mixed"` shows a dash: some of the values behind the checkbox are on and some are off, as with several selected objects or a group of child options. Screen readers announce it as partially checked. A click on a mixed checkbox asks for `true`; the owner decides what that means and passes the new value back.',
    disabledTitle: 'Disabled',
    disabledText:
      'A disabled checkbox ignores the mouse, the keyboard and clicks on its label, leaves the Tab order and shows its state in disabled colors.',
    keyboardOtherTitle: 'Keyboard and other props',
    keyboardOtherText:
      "Tab reaches the checkbox and Space switches it, as with a native checkbox; Enter does nothing. Inside a toolbar the checkbox joins the toolbar's arrow order. `ref` receives the `input` element, and native input attributes such as `id`, `name` and `aria-describedby` pass through. `className` goes to the outer element and is meant only for layout.",
  },
  ru: {
    pageTitle: 'Checkbox',
    pageDescription:
      'Флажок для логического значения со смешанным состоянием для частичных значений.',
    checkedStateTitle: 'Состояние и подпись',
    checkedStateText:
      'Флажок переключает логическое значение. Состояние управляемое: `checked` задаёт его, а `onCheckedChange` получает запрошенное новое значение. Это нативный `input type="checkbox"`, нарисованный токенами.',
    checkedStateText2:
      '`label` показывает текст справа от флажка, и клик по тексту тоже переключает флажок. Без видимой подписи назовите флажок через `aria-label` или укажите на подпись через `aria-labelledby`: одно из трёх требуют типы. Подпись слева даёт строка свойства вокруг поля.',
    mixedStateTitle: 'Смешанное состояние',
    mixedStateText:
      '`checked="mixed"` показывает черту: часть значений за флажком включена, а часть выключена, как у нескольких выбранных объектов или группы вложенных параметров. Скринридеры объявляют его частично отмеченным. Клик по смешанному флажку запрашивает `true`; что это значит, решает владелец, и он же передаёт новое значение обратно.',
    disabledTitle: 'Отключённый флажок',
    disabledText:
      'Отключённый флажок не реагирует на мышь, клавиатуру и клики по подписи, выпадает из порядка Tab и показывает состояние цветами отключённого элемента.',
    keyboardOtherTitle: 'Клавиатура и остальные пропсы',
    keyboardOtherText:
      'Tab доходит до флажка, пробел переключает его, как у нативного флажка; Enter ничего не делает. Внутри панели инструментов флажок встаёт в общий порядок стрелок. `ref` получает элемент `input`, а нативные атрибуты поля вроде `id`, `name` и `aria-describedby` передаются дальше. `className` уходит на внешний элемент и нужен только для раскладки.',
  },
});
