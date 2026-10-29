import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const toggleButtonGroupPageMessages = defineDocMessages({
  en: {
    pageTitle: 'ToggleButtonGroup',
    pageDescription: 'A row of toggle buttons to choose one, none or one, or several options.',
    whenUseTitle: 'When to use it',
    whenUseText:
      'ToggleButtonGroup is a row of toggle buttons for compact choices in toolbars and headers: the transform tool, the view mode, snapping options. Arrow keys only move the focus, and an option is chosen with a click, Space or Enter. Moving through the tools does not switch the tool on the way.',
    whenUseText2:
      'For a choice in a form or a settings panel, where the options are a list of labelled values, use RadioGroup. There arrow keys select the next option at once, as with native radio buttons.',
    exactlyOneTitle: 'Exactly one',
    exactlyOneText:
      'With `selection="single"` one option is always chosen. `value` is the chosen option, and clicking it again changes nothing.',
    noneOneTitle: 'None or one',
    noneOneText:
      'With `selection="optional"` clicking the chosen option clears the choice, and `value` becomes `null`.',
    severalTitle: 'Several',
    severalText:
      'With `selection="multiple"` every option is switched on its own. `value` is an array of the chosen options, always in the order of `options`. An option with `disabled: true` is skipped by the keyboard; `disabled` on the group disables every option.',
    optionsTitle: 'Options',
    optionsText:
      'Each option has a `value` and a `label`. `icon` adds an icon before the label, and `iconOnly: true` shows only the icon, with the label as the name and the hover hint. `lang` marks the language of the label, for example in a language switcher. The type of `value` comes from `options`, so `onValueChange` receives the same string union.',
    keyboardAccessibilityTitle: 'Keyboard and accessibility',
    keyboardAccessibilityText:
      "The group has the `group` role and a required `label`, and each option is a button with `aria-pressed` in every mode. The group is one Tab stop that starts at the chosen option. Inside a toolbar the group joins the toolbar's arrow order, so the whole toolbar stays one Tab stop. `variant`, `size` and `className` work as for `ToggleButton`.",
  },
  ru: {
    pageTitle: 'ToggleButtonGroup',
    pageDescription:
      'Ряд переключаемых кнопок: выбор одного варианта, одного или ни одного, или нескольких.',
    whenUseTitle: 'Когда использовать',
    whenUseText:
      'ToggleButtonGroup — ряд переключаемых кнопок для компактного выбора в панелях инструментов и заголовках: инструмент трансформации, режим вида, параметры привязки. Стрелки только переводят фокус, а вариант выбирается кликом, пробелом или Enter. Проход по инструментам не переключает инструмент по пути.',
    whenUseText2:
      'Для выбора в форме или панели настроек, где варианты — список подписанных значений, используйте RadioGroup. Там стрелки сразу выбирают следующий вариант, как у нативных радиокнопок.',
    exactlyOneTitle: 'Ровно один',
    exactlyOneText:
      'При `selection="single"` один вариант выбран всегда. `value` — выбранный вариант, и повторный клик по нему ничего не меняет.',
    noneOneTitle: 'Один или ни одного',
    noneOneText:
      'При `selection="optional"` клик по выбранному варианту снимает выбор, и `value` становится `null`.',
    severalTitle: 'Несколько',
    severalText:
      'При `selection="multiple"` каждый вариант включается сам по себе. `value` — массив выбранных вариантов, всегда в порядке `options`. Вариант с `disabled: true` клавиатура пропускает; `disabled` на группе отключает все варианты.',
    optionsTitle: 'Варианты',
    optionsText:
      'У каждого варианта есть `value` и `label`. `icon` добавляет иконку перед подписью, а `iconOnly: true` показывает только иконку, и подпись становится именем и подсказкой при наведении. `lang` указывает язык подписи, например в переключателе языка. Тип `value` выводится из `options`, поэтому `onValueChange` получает то же объединение строк.',
    keyboardAccessibilityTitle: 'Клавиатура и доступность',
    keyboardAccessibilityText:
      'У группы роль `group` и обязательный `label`, каждый вариант — кнопка с `aria-pressed` в любом режиме. Группа — одна остановка Tab, которая начинается с выбранного варианта. Внутри панели инструментов группа встаёт в общий порядок стрелок, и вся панель остаётся одной остановкой Tab. `variant`, `size` и `className` работают как у `ToggleButton`.',
  },
});
