import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const searchFieldPageMessages = defineDocMessages({
  en: {
    pageTitle: 'SearchField',
    pageDescription: 'A query input that filters a window, with a clear button.',
    filteringTitle: 'Filtering',
    filteringText:
      'A search field filters the contents of a window. It is a native `input type="search"` with a magnifier and a clear button. The value is controlled, and `onValueChange` receives the query on every input: a search query is not scene data, so the field does not use the preview and commit protocol. Delaying an expensive filter is up to the owner.',
    filteringText2:
      '`label` names the field for screen readers, `clearLabel` names the clear button and shows in its tooltip. The clear button appears only when the field is not empty, is not a Tab stop and keeps focus in the field.',
    keyboardOtherTitle: 'Keyboard and other props',
    keyboardOtherText:
      "Esc clears the query, and a second Esc leaves the field. Esc that clears the query does not close a dialog, popover or menu around the field. A window focuses its search field with its own hotkey, such as Mod+F in the window's scope, not with logic inside the field. `resultsRef` points to the results, such as a `TreeView` or a `ListView` below the field: then Down moves the focus there. The [TreeView](components/tree-view) page shows it in an example. Inside a toolbar the field joins the toolbar's Tab stop. Disabled and read-only fields hide the clear button. `ref` receives the `input` element, and native input attributes such as `placeholder` pass through. `className` goes to the outer box and is meant only for layout.",
  },
  ru: {
    pageTitle: 'SearchField',
    pageDescription: 'Поле запроса, которое фильтрует содержимое окна, с кнопкой очистки.',
    filteringTitle: 'Фильтрация',
    filteringText:
      'Поле поиска фильтрует содержимое окна. Это нативный `input type="search"` с лупой и кнопкой очистки. Значение управляемое, а `onValueChange` получает запрос при каждом вводе: поисковый запрос — не данные сцены, поэтому протокол предпросмотра и фиксации поле не использует. Откладывать дорогую фильтрацию — забота владельца.',
    filteringText2:
      '`label` называет поле для скринридеров, `clearLabel` называет кнопку очистки и показывается в её подсказке. Кнопка очистки появляется, только когда поле не пустое, не является остановкой Tab и оставляет фокус в поле.',
    keyboardOtherTitle: 'Клавиатура и остальные пропсы',
    keyboardOtherText:
      'Esc очищает запрос, второй Esc выходит из поля. Esc, который очистил запрос, не закрывает диалог, всплывающую панель или меню вокруг поля. Окно переводит фокус в своё поле поиска своей горячей клавишей, например Mod+F в области окна, а не логикой внутри поля. `resultsRef` указывает на результаты, например `TreeView` или `ListView` под полем: тогда стрелка вниз переводит фокус туда. Пример — на странице [TreeView](components/tree-view). Внутри панели инструментов поле встаёт в её остановку Tab. Отключённое поле и поле только для чтения прячут кнопку очистки. `ref` получает элемент `input`, а нативные атрибуты поля вроде `placeholder` передаются дальше. `className` уходит на внешнюю рамку и нужен только для раскладки.',
  },
});
