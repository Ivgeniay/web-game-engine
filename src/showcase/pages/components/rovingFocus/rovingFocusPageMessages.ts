import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const rovingFocusPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Roving focus',
    pageDescription:
      'One Tab stop for a group of controls, with arrow keys inside: the mechanism behind toolbars and groups.',
    howWorksTitle: 'How it works',
    howWorksText:
      'Roving focus makes a group of controls a single Tab stop. Tab enters the group on one item, arrow keys move between the items, and the next Tab leaves the group. Toolbar, ToggleButtonGroup and RadioGroup are built on it, and so will be Tabs and Breadcrumbs.',
    howWorksItem:
      'Arrow keys follow the `orientation`: Left and Right in a `horizontal` group, Up and Down in a `vertical` one, all four with `both`, as RadioGroup does. Home and End go to the first and the last item.',
    howWorksItem2:
      'By default the focus wraps from the last item to the first. Pass `loop: false` to stop at the ends.',
    howWorksItem3: 'Disabled items are skipped.',
    howWorksItem4:
      'Tab returns to the item focused last. Before that it lands on a preferred item, such as the selected option, and otherwise on the first enabled item.',
    howWorksItem5:
      'Text fields inside a group keep the arrow keys for the caret. An item that handles an arrow key itself calls `event.preventDefault()`, and the group leaves that key alone.',
    groupButtonsTitle: 'A group of buttons',
    groupButtonsText:
      '`useRovingFocusGroup` returns the group `registry` and an `onKeyDown` handler. Pass the registry to `RovingFocusContext`, put the handler on the group element and give the element a role and a label. Button, IconButton and ToggleButton join the nearest group by themselves and behave as ordinary buttons outside of one.',
    customItemsTitle: 'Custom items',
    customItemsText:
      "Any focusable element joins a group through `useRovingFocusItem`. It takes the element's own `ref`, `tabIndex` and `onFocus`, and returns them merged with the group's, ready to spread on the element. `disabled` takes the item out of the arrow order, `preferred` makes it the first Tab stop.",
    nestedGroupsTitle: 'Nested groups',
    nestedGroupsText:
      "With `joinParentGroup: true` a group inside another group does not start its own: its items join the outer one. ToggleButtonGroup does this, so inside a toolbar its buttons are part of the toolbar's arrow order and the toolbar stays one Tab stop. Without the option the inner group keeps its own Tab stop and arrow keys.",
    nestedGroupsText2:
      '`onNavigate` is called with the element the arrow key moved to. RadioGroup uses it to select the option that receives the focus.',
  },
  ru: {
    pageTitle: 'Роуминговый фокус',
    pageDescription:
      'Одна остановка Tab на группу элементов и стрелки внутри неё: механизм панелей инструментов и групп.',
    howWorksTitle: 'Как это работает',
    howWorksText:
      'Роуминговый фокус делает группу элементов одной остановкой Tab. Tab входит в группу на одном элементе, стрелки переходят между элементами, а следующий Tab выходит из группы. На нём построены Toolbar, ToggleButtonGroup и RadioGroup, а потом будут построены Tabs и Breadcrumbs.',
    howWorksItem:
      'Стрелки следуют `orientation`: влево и вправо в группе `horizontal`, вверх и вниз в `vertical`, все четыре при `both`, как у RadioGroup. Home и End ведут к первому и последнему элементу.',
    howWorksItem2:
      'По умолчанию фокус переходит с последнего элемента на первый по кругу. Передайте `loop: false`, чтобы он останавливался на краях.',
    howWorksItem3: 'Отключённые элементы пропускаются.',
    howWorksItem4:
      'Tab возвращается на элемент, где фокус был в последний раз. До этого он попадает на предпочтительный элемент, например на выбранный вариант, а иначе — на первый включённый.',
    howWorksItem5:
      'Текстовые поля внутри группы оставляют стрелки для курсора. Элемент, который сам обрабатывает стрелку, вызывает `event.preventDefault()`, и группа эту клавишу не трогает.',
    groupButtonsTitle: 'Группа кнопок',
    groupButtonsText:
      '`useRovingFocusGroup` возвращает реестр группы `registry` и обработчик `onKeyDown`. Передайте реестр в `RovingFocusContext`, повесьте обработчик на элемент группы и дайте элементу роль и подпись. Button, IconButton и ToggleButton сами встают в ближайшую группу, а вне группы ведут себя как обычные кнопки.',
    customItemsTitle: 'Свои элементы',
    customItemsText:
      'Любой фокусируемый элемент встаёт в группу через `useRovingFocusItem`. Хук принимает собственные `ref`, `tabIndex` и `onFocus` элемента и возвращает их объединёнными с пропсами группы, готовыми к развёртыванию на элементе. `disabled` убирает элемент из порядка стрелок, `preferred` делает его первой остановкой Tab.',
    nestedGroupsTitle: 'Вложенные группы',
    nestedGroupsText:
      'С `joinParentGroup: true` группа внутри другой группы не заводит свою: её элементы встают во внешнюю. Так делает ToggleButtonGroup, поэтому внутри панели инструментов его кнопки входят в порядок стрелок панели, и панель остаётся одной остановкой Tab. Без этой опции внутренняя группа сохраняет свою остановку Tab и свои стрелки.',
    nestedGroupsText2:
      '`onNavigate` вызывается с элементом, на который перешла стрелка. RadioGroup так выбирает вариант, который получает фокус.',
  },
});
