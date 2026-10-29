import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const tooltipPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Tooltip',
    pageDescription: 'A short hint with an optional shortcut, shown on hover and keyboard focus.',
    hintAnyTitle: 'A hint on any control',
    hintAnyText:
      '`Tooltip` shows a short hint next to a control: `content` is a ready string, `shortcut` an optional key combination shown with `Kbd`. Its child is a function that receives the trigger props; spread them on the control, including the `ref`. Any primitive works as a trigger.',
    hintAnyText2:
      'The hint appears after a hover delay of half a second, at once on keyboard focus, and hides when the pointer leaves, the focus moves away, the control is pressed or Esc is hit. It never takes the focus. The trigger is described by the hint through `aria-describedby`; pass `describe={false}` when the hint repeats the accessible name of the control. `disabled` turns the hint off.',
    builtIntoTitle: 'Built into primitives',
    builtIntoText:
      '`IconButton`, an icon-only `ToggleButton` and a truncated `Label` show their tooltips by themselves, so most code never uses `Tooltip` directly. `IconButton` takes a `shortcut` for its tooltip.',
    builtIntoText2:
      'After one hint was shown, the hints of neighbouring controls appear without the delay: move the pointer along the row below. The grouping needs `PopupLayer` at the root of the app; see the [Popup layer](components/popup-layer) page.',
    limitationsTitle: 'Limitations',
    limitationsItem: 'Hints do not appear while a menu or a list is open.',
    limitationsItem2:
      'A disabled control gets no pointer events, so it shows no hint. Explain why a command is unavailable elsewhere, for example in the status bar.',
  },
  ru: {
    pageTitle: 'Tooltip',
    pageDescription:
      'Короткая подсказка с необязательным сочетанием клавиш; появляется при наведении и фокусе с клавиатуры.',
    hintAnyTitle: 'Подсказка на любом элементе',
    hintAnyText:
      '`Tooltip` показывает короткую подсказку рядом с элементом: `content` — готовая строка, `shortcut` — необязательное сочетание клавиш, которое показывается через `Kbd`. Дочерний элемент — функция, которая получает пропсы триггера; разверните их на элементе, включая `ref`. Триггером может быть любой примитив.',
    hintAnyText2:
      'Подсказка появляется после задержки наведения в полсекунды, сразу — при фокусе с клавиатуры и прячется, когда указатель уходит, фокус уходит, элемент нажат или нажат Esc. Фокус она никогда не забирает. Подсказка описывает триггер через `aria-describedby`; передайте `describe={false}`, если подсказка повторяет доступное имя элемента. `disabled` выключает подсказку.',
    builtIntoTitle: 'Встроенные в примитивы',
    builtIntoText:
      '`IconButton`, `ToggleButton` только с иконкой и обрезанный `Label` показывают подсказки сами, поэтому большей части кода `Tooltip` напрямую не нужен. `IconButton` принимает `shortcut` для своей подсказки.',
    builtIntoText2:
      'После того как одна подсказка показалась, подсказки соседних элементов появляются без задержки: проведите указателем по ряду ниже. Для такой группировки нужен `PopupLayer` в корне приложения; см. страницу [Слой всплывающих элементов](components/popup-layer).',
    limitationsTitle: 'Ограничения',
    limitationsItem: 'Подсказки не появляются, пока открыто меню или список.',
    limitationsItem2:
      'Отключённый элемент не получает событий указателя, поэтому подсказку не показывает. Объясняйте, почему команда недоступна, в другом месте, например в строке состояния.',
  },
});
