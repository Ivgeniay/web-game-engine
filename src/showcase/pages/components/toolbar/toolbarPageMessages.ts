import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const toolbarPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Toolbar',
    pageDescription: 'A row of controls along the edge of a window that is one Tab stop.',
    toolbarPrimitivesTitle: 'A toolbar of primitives',
    toolbarPrimitivesText:
      'Toolbar is a row of controls along the edge of a window. It has the `toolbar` role and a required `label`, the height of `--size-toolbar-height` and the header background. Put any primitives inside: the example uses every primitive of this section except RadioGroup, which belongs in forms; a toolbar uses ToggleButtonGroup for the same choice.',
    keyboardTitle: 'Keyboard',
    keyboardText:
      'The whole toolbar is one Tab stop, built on roving focus. Left and Right move through the controls and skip disabled ones (see below for the exception), Home and End go to the ends, and the focus wraps around. Tab lands on the control focused last; before that, on the chosen option of a toggle group or on the first control.',
    keyboardText2:
      'Button, IconButton, ToggleButton and Checkbox join the toolbar by themselves, and the buttons of a ToggleButtonGroup join it one by one, so the arrow keys go through the group too. Text fields inside a toolbar keep Left and Right for the caret.',
    disabledButTitle: 'Disabled but focusable',
    disabledButText:
      'A natively disabled control drops out of the Tab order and the arrow keys, so a keyboard user cannot learn that the toolbar has an unavailable command, and a disabled button gets no tooltip. Button, IconButton and ToggleButton accept `focusableWhenDisabled`: together with `disabled` it renders `aria-disabled` instead of the native attribute. The control looks disabled and ignores clicks, Enter and Space, but it stays in the roving focus and shows its tooltip. Use it in toolbars, as the main toolbar of the editor does; elsewhere keep the native `disabled`.',
    layoutTitle: 'Layout',
    layoutText:
      'Controls sit in a row with a small gap. A vertical `Separator` divides groups, and a flexible one pushes the controls after it to the end. The toolbar does not hide overflowing controls yet: that is planned as a "more" menu. Use `className` only for the placement of the toolbar, for example a border towards the content below.',
  },
  ru: {
    pageTitle: 'Toolbar',
    pageDescription:
      'Ряд элементов управления вдоль края окна, который занимает одну остановку Tab.',
    toolbarPrimitivesTitle: 'Панель инструментов из примитивов',
    toolbarPrimitivesText:
      'Toolbar — ряд элементов управления вдоль края окна. У неё роль `toolbar` и обязательный `label`, высота `--size-toolbar-height` и фон заголовка. Внутрь кладётся любой примитив: в примере есть все примитивы этого раздела, кроме RadioGroup, место которой в формах; для того же выбора в панели инструментов служит ToggleButtonGroup.',
    keyboardTitle: 'Клавиатура',
    keyboardText:
      'Вся панель — одна остановка Tab, построенная на роуминговом фокусе. Стрелки влево и вправо переходят по элементам и пропускают отключённые (об исключении — ниже), Home и End ведут к краям, фокус идёт по кругу. Tab попадает на элемент, где фокус был в последний раз, а до этого — на выбранный вариант группы переключателей или на первый элемент.',
    keyboardText2:
      'Button, IconButton, ToggleButton и Checkbox встают в панель сами, а кнопки ToggleButtonGroup — каждая по отдельности, поэтому стрелки проходят и через группу. Текстовые поля внутри панели оставляют стрелки влево и вправо для курсора.',
    disabledButTitle: 'Отключённый, но фокусируемый',
    disabledButText:
      'Элемент с нативным `disabled` выпадает из порядка Tab и стрелок, поэтому пользователь клавиатуры не узнает, что в панели есть недоступная команда, а у отключённой кнопки нет подсказки. Button, IconButton и ToggleButton принимают `focusableWhenDisabled`: вместе с `disabled` он ставит `aria-disabled` вместо нативного атрибута. Элемент выглядит отключённым и гасит клики, Enter и пробел, но остаётся в роуминговом фокусе и показывает подсказку. Используйте его в панелях инструментов, как главная панель инструментов редактора; в остальных местах оставляйте нативный `disabled`.',
    layoutTitle: 'Расположение',
    layoutText:
      'Элементы стоят в ряд с небольшим промежутком. Вертикальный `Separator` разделяет группы, а гибкий отодвигает элементы после себя к концу. Не поместившиеся элементы панель пока не прячет: для этого запланировано меню «ещё». `className` — только для размещения панели, например для рамки со стороны содержимого под ней.',
  },
});
