# Глоссарий каркаса

Единые переводы терминов каркаса. Здесь только термины каркаса: термины движков ведут разработчики движков у себя.

Переводы терминов лежат в словаре `src/core/i18n/commonMessages.ts`. При изменении глоссария словарь меняется вместе с ним.

| English | Русский |
|---|---|
| Window | Окно |
| Panel | Панель |
| Tab | Вкладка |
| Layout | Раскладка |
| Menu | Меню |
| Toolbar | Панель инструментов |
| Status bar | Строка состояния |
| Theme | Тема |
| Dark / Light / System | Тёмная / Светлая / Как в системе |
| Language | Язык |
| OK / Cancel / Apply / Close | ОК / Отмена / Применить / Закрыть |
| Reset | Сбросить |
| Maximize | Развернуть |
| Undo / Redo | Отменить / Повторить |

## Термины документации

Термины витрины и её документации. Это не строки интерфейса, поэтому в `commonMessages` их нет. Названия компонентов (Button, TreeView, ComponentHeader) — имена из кода и не переводятся.

| English | Русский | Решение |
|---|---|---|
| Showcase | Витрина | |
| Framework | Каркас | |
| Integration | Интеграция | |
| Engine developer | Разработчик движка | |
| UI primitive | UI-примитив, примитив | |
| Token | Токен | |
| Registry | Реестр | |
| Handler | Обработчик | |
| Extension point | Точка расширения | |
| Demo scene | Демо-сцена | |
| Live example | Живой пример | |
| Overview / Foundations / Components / Shell | Обзор / Основы / Компоненты / Оболочка | Разделы витрины |
| Docking | Докинг | Устоявшийся термин, «стыковка» не прижилась |
| Hotkey, shortcut | Горячая клавиша, сочетание клавиш | |
| Hotkey scope | Область сочетаний | |
| Roving focus | Роуминговый фокус | Калька, как в документации доступности |
| Drag and drop | Перенос данных | Механизм `src/ui/dragAndDrop/`; действие пользователя — «перетаскивание» |
| Value drag | Перетаскивание значения | |
| Popup | Всплывающий элемент | |
| Popup layer | Слой всплывающих элементов | |
| Popover | Всплывающая панель | Имя компонента `Popover` не переводится |
| Trigger | Триггер | |
| Inspector | Инспектор | |
| Menu bar | Главное меню | |
| Confirm dialog | Диалог подтверждения | |
| Undo stack | Стек отмены | |
| Window tab menu | Меню вкладки окна | |
| Editor frame | Каркас страницы редактора | `EditorFrame` |
| Dictionary | Словарь | |
| Placeholder, substitution | Подстановка | |
| Message reference | Ссылка на перевод | `MessageRef` |
| Commit / preview / cancel | Фиксация / предпросмотр / отмена | Фазы протокола изменения значения |
| Promise | Промис | |
| Mock data | Мок-данные | |
| Production build | Production-сборка | |
| Store | Стор | Сторы Zustand |
| Selector | Селектор | |
| Entry point | Точка входа | |
| Source of truth | Источник правды | |
| Focus outline | Рамка фокуса | |
| Easing | Плавность, кривая плавности | Кривые `--easing-*`. Не «сглаживание»: в графике это anti-aliasing |
| Reduced motion | Уменьшение движения | Настройка ОС `prefers-reduced-motion` |
| Assistive technologies | Вспомогательные технологии | |
| Pixel grid | Пиксельная сетка | |
| Raster | Растр | |
| Outline (of an icon drawing) | Контур | Не путать с рамкой фокуса |
| Glyph | Глиф | |
| Placeholder icon | Заглушка | Иконка `unknown`; подстановка в переводе — «подстановка» |
| Pass / fail (contrast) | Норма / ниже нормы | |
| Screen reader | Скринридер | Так говорят русскоязычные разработчики; «программа экранного доступа» — слишком длинно |
| Props | Пропсы | |
| Tab stop | Остановка Tab | |
| Tab order | Порядок Tab | |
| Tooltip, hint | Подсказка | Имя компонента `Tooltip` не переводится |
| Toggle button | Переключаемая кнопка | `ToggleButton` |
| Checkbox | Флажок | `Checkbox` |
| Radio button | Радиокнопка | |
| Caption, label | Подпись | |
| Mixed state | Смешанное состояние | |
| Read-only | Только для чтения | |
| Caret | Курсор | Текстовый курсор в поле |
| Draft | Черновик | Текст поля до фиксации |
| Value change protocol | Протокол изменения значения | `@/contracts/valueChange` |
| Property row | Строка свойства | `PropertyRow` |
| Drag preview | Превью | Подпись рядом с указателем; фаза `preview` — «предпросмотр» |
| Drop target | Цель переноса | |
| Anchor | Якорь | Элемент, к которому привязан всплывающий элемент, и якорь диапазона выделения |
| Stacking order | Порядок наложения | |
| Viewport | Окно просмотра | Координаты `point` у меню |
| Pointer lock | Блокировка указателя | Pointer Lock API |
| Error bubble | Пузырь | Сообщение об ошибке поля |
| Accessible name | Доступное имя | |
| Snapshot | Снимок | Снимок стора |
| Command definition | Описание команды | `defineCommand`; поведение — «обработчик» |
| Invocation | Вызов | `CommandInvocation` |
| Integration entry point | Точка подключения интеграции | `EditorExtension`; не путать с точкой входа приложения |
| Key map | Карта клавиш | |
| Text composition | Составной ввод | Ввод через IME |
| Workspace | Рабочая область | |
| Split (layout) | Разделение | `splitLayout` |
| Single-instance / multi-instance window | Одиночное окно / окно с несколькими экземплярами | |
| Undo entry | Запись | Запись стека отмены |
| Operation | Операция | `UndoOperation` |
| Redo branch | Ветка повтора | |
| Queue | Очередь | Очередь запросов подтверждения |
| Slider | Ползунок | Имя компонента `Slider` не переводится |
| Thumb | Бегунок | Подвижная часть ползунка |
| Rail, track | Дорожка | По ней движется бегунок |
| Logarithmic scale | Логарифмическая шкала | |
| Multiline field | Многострочное поле | `TextArea` |
| Flags field, flag | Поле флагов, флаг | `FlagsField` |
| Split button | Кнопка с меню | `SplitButton`; части — «основная часть» и «стрелка» |
| Summary (of a field) | Сводка | Подпись поля флагов: «Ничего», «Всё», «Смешано» или имена |
| Color picker | Окно выбора цвета | `ColorPicker`; в интерфейсе — «Выбор цвета» |
| Color field | Поле цвета | `ColorField` |
| Swatch | Образец | Образец цвета в поле |
| Checkerboard | Шахматка | Фон под прозрачным цветом, токены `checker-*` |
| Hue / saturation / brightness | Тон / насыщенность / яркость | Модель HSV |
| Alpha channel | Альфа-канал | В подписях полей — «Альфа» |
| Color model | Модель цвета | RGB 0–255, RGB 0–1, HSV |
| Eyedropper | Пипетка | `EyeDropper` API |
| Hex | HEX | Шестнадцатеричная запись цвета |

## Правила русского перевода

- Обычный регистр предложения, а не каждое слово с большой буквы: «Сбросить раскладку», а не «Сбросить Раскладку».
- Без точки в конце пунктов меню и подписей.
