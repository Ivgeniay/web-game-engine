import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const radioGroupPageMessages = defineDocMessages({
  en: {
    pageTitle: 'RadioGroup',
    pageDescription:
      'A list of labelled options to choose one value, with arrow keys that choose at once.',
    choosingOneTitle: 'Choosing one option',
    choosingOneText:
      'RadioGroup chooses one value from a list of labelled options, typically in forms and settings. Each option is a native `input type="radio"` with its label; clicking the label selects the option. The group has the `radiogroup` role and a required `label`.',
    choosingOneText2:
      '`value` is the chosen option or `null` when nothing is chosen yet. `onValueChange` receives the newly chosen option; a group cannot be cleared back to `null` by the user. The type of the value comes from `options`. For compact choices in toolbars use ToggleButtonGroup instead.',
    horizontalLayoutTitle: 'Horizontal layout',
    horizontalLayoutText:
      '`orientation="horizontal"` places the options in a row that wraps when it does not fit. The keyboard works the same in both layouts. This group starts without a chosen option.',
    disabledOptionsTitle: 'Disabled options',
    disabledOptionsText:
      'An option with `disabled: true` cannot be chosen and is skipped by the arrow keys. `disabled` on the group disables every option and takes the group out of the Tab order.',
    keyboardTitle: 'Keyboard',
    keyboardText:
      'The group is one Tab stop. Tab lands on the chosen option, or on the first enabled one when nothing is chosen. Arrow keys in either direction move to the next or the previous option and choose it at once, wrapping around the ends. Space chooses the focused option, which matters only before anything is chosen. `lang` on an option marks the language of its label, and `className` is meant only for layout.',
  },
  ru: {
    pageTitle: 'RadioGroup',
    pageDescription:
      'Список подписанных вариантов для выбора одного значения; стрелки меняют выбор сразу.',
    choosingOneTitle: 'Выбор одного варианта',
    choosingOneText:
      'RadioGroup выбирает одно значение из списка подписанных вариантов, обычно в формах и настройках. Каждый вариант — нативный `input type="radio"` со своей подписью; клик по подписи выбирает вариант. У группы роль `radiogroup` и обязательный `label`.',
    choosingOneText2:
      '`value` — выбранный вариант или `null`, пока ничего не выбрано. `onValueChange` получает новый выбранный вариант; вернуть группу к `null` пользователь не может. Тип значения выводится из `options`. Для компактного выбора в панелях инструментов используйте ToggleButtonGroup.',
    horizontalLayoutTitle: 'Горизонтальное расположение',
    horizontalLayoutText:
      '`orientation="horizontal"` ставит варианты в ряд, который переносится, если не помещается. Клавиатура работает одинаково в обоих расположениях. Эта группа начинает без выбранного варианта.',
    disabledOptionsTitle: 'Отключённые варианты',
    disabledOptionsText:
      'Вариант с `disabled: true` нельзя выбрать, и стрелки его пропускают. `disabled` на группе отключает все варианты и убирает группу из порядка Tab.',
    keyboardTitle: 'Клавиатура',
    keyboardText:
      'Группа — одна остановка Tab. Tab попадает на выбранный вариант или, если ничего не выбрано, на первый включённый. Стрелки в любую сторону переходят к следующему или предыдущему варианту и сразу выбирают его, по кругу через края. Пробел выбирает вариант с фокусом — это важно, только пока ничего не выбрано. `lang` у варианта указывает язык подписи, а `className` нужен только для раскладки.',
  },
});
