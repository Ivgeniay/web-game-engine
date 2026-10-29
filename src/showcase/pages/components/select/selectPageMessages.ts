import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const selectPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Select',
    pageDescription:
      'A field that chooses one value from a list, with icons, separators and an action.',
    choosingValueTitle: 'Choosing a value',
    choosingValueText:
      '`Select` chooses one value from a list. `options` is an array of entries: `option` with a `value`, a `label`, an optional `icon` and `disabled`, or a `separator`. The type of the value comes from the options, so `onValueChange` receives the same string union. `value` may be `null`; then the field shows `placeholder`.',
    choosingValueText2:
      'Name the field with `aria-label` or with `aria-labelledby` pointing to a visible caption, as in the example. The list opens with the chosen option focused and scrolled into view, marked with a check.',
    actionAtTitle: 'An action at the end',
    actionAtText:
      '`action` adds a command below the options, separated by a line, for example to create a new value. Choosing it runs `onSelect` and closes the list without changing the value.',
    toolbarTitle: 'In a toolbar',
    toolbarText:
      'The field takes `variant` and `size` like a button: `flat` and `sm` fit a toolbar. Inside a toolbar the field joins its arrow order.',
    keyboardTitle: 'Keyboard',
    keyboardItem: 'Enter, Space and Alt+Down open the list.',
    keyboardItem2:
      'On the closed field, arrows and letters do nothing, so the value never changes by accident while moving through a panel.',
    keyboardItem3:
      'In the open list, Up and Down move and wrap around, Home and End go to the ends, disabled options are skipped, and typing the first letters moves to an option.',
    keyboardItem4:
      'Enter or Space chooses the option and returns the focus to the field. Esc and a click outside close the list without a change.',
    keyboardText:
      'Hints do not appear while the list is open. There is no search inside the list: a searchable list is a separate component. `disabled`, `id`, `ref` and `className` apply to the field.',
  },
  ru: {
    pageTitle: 'Select',
    pageDescription: 'Поле выбора одного значения из списка с иконками, разделителями и действием.',
    choosingValueTitle: 'Выбор значения',
    choosingValueText:
      '`Select` выбирает одно значение из списка. `options` — массив записей: `option` с `value`, `label`, необязательными `icon` и `disabled` или `separator`. Тип значения выводится из вариантов, поэтому `onValueChange` получает то же объединение строк. `value` может быть `null`; тогда поле показывает `placeholder`.',
    choosingValueText2:
      'Назовите поле через `aria-label` или через `aria-labelledby` со ссылкой на видимую подпись, как в примере. Список открывается с фокусом на выбранном варианте, прокрученном в видимую область и отмеченном галочкой.',
    actionAtTitle: 'Действие в конце',
    actionAtText:
      '`action` добавляет команду под вариантами, отделённую линией, например чтобы создать новое значение. Её выбор вызывает `onSelect` и закрывает список, не меняя значение.',
    toolbarTitle: 'В панели инструментов',
    toolbarText:
      'Поле принимает `variant` и `size`, как кнопка: для панели инструментов подходят `flat` и `sm`. Внутри панели поле встаёт в её порядок стрелок.',
    keyboardTitle: 'Клавиатура',
    keyboardItem: 'Enter, пробел и Alt+стрелка вниз открывают список.',
    keyboardItem2:
      'На закрытом поле стрелки и буквы ничего не делают, поэтому значение не меняется случайно, пока вы ходите по панели.',
    keyboardItem3:
      'В открытом списке стрелки вверх и вниз ходят по кругу, Home и End ведут к краям, отключённые варианты пропускаются, а набор первых букв переходит к варианту.',
    keyboardItem4:
      'Enter или пробел выбирают вариант и возвращают фокус в поле. Esc и клик снаружи закрывают список без изменений.',
    keyboardText:
      'Пока список открыт, подсказки не появляются. Поиска внутри списка нет: список с поиском — отдельный компонент. `disabled`, `id`, `ref` и `className` относятся к полю.',
  },
});
