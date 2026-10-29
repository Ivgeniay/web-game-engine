import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const iconsPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Icons',
    pageDescription:
      'Framework icons, the `Icon` component, icons in data, integration icon sets and drawing rules.',
    galleryTitle: 'Framework icons',
    galleryIntro:
      'Every icon of the framework at its two sizes: 16 px (`--size-icon-md`) and 12 px (`--size-icon-sm`). Select an icon to see it enlarged on its pixel grid together with the code that uses it. The enlarged view is a real 1× raster of the icon, so a line that misses the pixel grid shows up as a blurred two-pixel line. Turn on the outline to see the geometry of the drawing on top of the raster. Use the theme switcher in the header to check the icons in both themes.',
    gallerySmallDrawing:
      'An icon marked `12×12` has its own drawing for the small size. Other icons are scaled down from their 16×16 drawing.',
    galleryShowOutline: 'Show outline',
    galleryUsage: 'Usage',
    galleryMediumCaption: '16 px',
    gallerySmallOwnCaption: '12 px, own 12×12 drawing',
    gallerySmallScaledCaption: '12 px, scaled from 16×16',
    galleryDensityNote:
      'Rasterized at 1× density, as on a standard screen. On high-density screens the icon looks sharper.',
    usingTitle: 'Using an icon',
    usingSets:
      'Icons come in sets. The framework set is `frameworkIcons` from `@/icons/frameworkIcons`. Pass an icon of a set to the `Icon` component from `@/ui/icon/Icon`. A set is a typed object, so a typo in an icon name is a compile error. `size` is `md` (16 px, the default) or `sm` (12 px).',
    usingColor:
      'An icon takes the text color of its parent through `currentColor`, so color it by setting `color` on the parent. Status colors are allowed for icons. An icon is decorative: it is hidden from assistive technologies and has no label of its own. The label belongs to the button that holds the icon: `IconButton` takes it as `label` and picks the icon size from its own size.',
    dataTitle: 'Icons in data',
    dataInCode:
      'Data written in code, such as a menu item registered by the integration, stores the icon itself: `{ icon: frameworkIcons.close }`. It is checked by the compiler.',
    dataFromString:
      'When the name of an icon arrives as a string, for example from a file or from the engine, store a reference with `iconRef(set, name)`: the set together with the name, as `messageRef` stores a dictionary together with a key. `Icon` accepts such a reference as well. If the set has no icon with that name, `Icon` shows the `unknown` placeholder and, in development, warns in the browser console. The interface keeps working. Below, `teleport` is such a missing name.',
    integrationTitle: 'Integration icons',
    integrationOwnSet:
      'There is no global list of icon names. The integration declares its own set in its own folder, for example `src/engine/icons/engineIcons.ts`, with the same `defineIcon` and `defineIcons` as the framework. Its icons are passed to `Icon` the same way and checked by the same types. No framework file has to change.',
    integrationFiles:
      'Keep one icon per file, named after the icon, and collect them into a set in one file. The drawing rules below apply to integration icons too: run `findIconGeometryProblems` from `@/icons/iconGeometry` over your set in a test, as the framework does for its own icons.',
    drawingTitle: 'Drawing an icon',
    drawingShapes:
      'An icon is data, not markup. Its drawing is a list of shapes: `stroke(d)` is an outlined path, `circle(cx, cy, r)` an outlined circle and `fillRect(x, y, width, height)` a filled detail, such as the dot of an exclamation mark. `md` is the 16×16 drawing and is required. `sm` is an optional 12×12 drawing for icons that blur or merge when scaled down to 12 px. Draw it only where it is really needed.',
    drawingOriginal:
      'Draw every icon from scratch. Do not copy, trace or re-create by coordinates icons of Unity, Lucide, Material, Codicons or any other set. An icon draws an idea, not someone else’s picture.',
    drawingGrid:
      'The grid is 16×16 with a 1 pixel margin: the working area is 1 to 15. On the 12×12 grid it is 1 to 11.',
    drawingLines:
      'Lines are 1 pixel thick. Horizontal and vertical lines lie on half coordinates, such as `x = 7.5`, so that they cover exactly one pixel row instead of blurring over two.',
    drawingEnds:
      'Line ends are square and joins are mitered. A line from 3.5 to 11.5 covers pixels 3 to 11 completely.',
    drawingAxis:
      'Symmetric icons share one axis: pixel 7, the coordinate 7.5 (5.5 on the 12×12 grid).',
    drawingCircles:
      'The extremes of a circle, `cx ± r` and `cy ± r`, lie on half coordinates. Diagonals go at 45° where possible, with ends on pixel centers.',
    drawingFills: 'Filled details use whole coordinates.',
    drawingWeight:
      'Shapes of the same visual weight have different sizes: a circle spans 13 pixels, a square 11, a glyph such as a cross or a chevron 9.',
    drawingCommands: 'Paths use absolute commands only: `M`, `L`, `H`, `V`, `A` and `Z`.',
    drawingColors:
      'There are no colors in a drawing. The `Icon` component paints strokes and fills with `currentColor`.',
    drawingCheck:
      '`findIconGeometryProblems` checks the working area, half coordinates, circles, filled details and path commands. Sharpness at 12 and 16 pixels is still checked by eye in the enlarged view above.',
  },
  ru: {
    pageTitle: 'Иконки',
    pageDescription:
      'Иконки каркаса, компонент `Icon`, иконки в данных, наборы иконок интеграции и правила рисования.',
    galleryTitle: 'Иконки каркаса',
    galleryIntro:
      'Все иконки каркаса в двух размерах: 16 px (`--size-icon-md`) и 12 px (`--size-icon-sm`). Выберите иконку, чтобы увидеть её увеличенной на пиксельной сетке вместе с кодом, который её использует. Увеличенный вид — настоящий растр иконки при плотности 1×, поэтому линия мимо пиксельной сетки видна как размытая линия в два пикселя. Включите контур, чтобы увидеть геометрию рисунка поверх растра. Переключателем темы в шапке проверьте иконки в обеих темах.',
    gallerySmallDrawing:
      'У иконки с пометкой `12×12` есть свой рисунок для малого размера. Остальные иконки уменьшаются из рисунка 16×16.',
    galleryShowOutline: 'Показать контур',
    galleryUsage: 'Использование',
    galleryMediumCaption: '16 px',
    gallerySmallOwnCaption: '12 px, свой рисунок 12×12',
    gallerySmallScaledCaption: '12 px, уменьшен из 16×16',
    galleryDensityNote:
      'Растр при плотности 1×, как на обычном экране. На экранах высокой плотности иконка выглядит чётче.',
    usingTitle: 'Как показать иконку',
    usingSets:
      'Иконки собраны в наборы. Набор каркаса — `frameworkIcons` из `@/icons/frameworkIcons`. Передайте иконку набора в компонент `Icon` из `@/ui/icon/Icon`. Набор — типизированный объект, поэтому опечатка в имени иконки — ошибка компиляции. `size` — `md` (16 px, по умолчанию) или `sm` (12 px).',
    usingColor:
      'Иконка берёт цвет текста родителя через `currentColor`, поэтому красится через `color` на родителе. Статусные цвета для иконок разрешены. Иконка декоративная: она скрыта от вспомогательных технологий и своей подписи не имеет. Подпись принадлежит кнопке с иконкой: `IconButton` принимает её как `label` и сам выбирает размер иконки по своему размеру.',
    dataTitle: 'Иконки в данных',
    dataInCode:
      'Данные, написанные в коде, например пункт меню, который регистрирует интеграция, хранят саму иконку: `{ icon: frameworkIcons.close }`. Это проверяет компилятор.',
    dataFromString:
      'Если имя иконки приходит строкой, например из файла или от движка, храните ссылку `iconRef(set, name)`: набор вместе с именем — так же, как `messageRef` хранит словарь вместе с ключом. `Icon` принимает и такую ссылку. Если в наборе нет иконки с таким именем, `Icon` показывает заглушку `unknown`, а в режиме разработки ещё и предупреждает в консоли браузера. Интерфейс продолжает работать. Ниже `teleport` — как раз такое отсутствующее имя.',
    integrationTitle: 'Иконки интеграции',
    integrationOwnSet:
      'Глобального списка имён иконок нет. Интеграция объявляет свой набор в своей папке, например `src/engine/icons/engineIcons.ts`, теми же `defineIcon` и `defineIcons`, что и каркас. Её иконки передаются в `Icon` так же и проверяются теми же типами. Ни один файл каркаса менять не нужно.',
    integrationFiles:
      'Держите по одной иконке в файле с именем иконки и собирайте их в набор в одном файле. Правила рисования ниже действуют и для иконок интеграции: прогоните свой набор через `findIconGeometryProblems` из `@/icons/iconGeometry` в тесте, как каркас делает со своими иконками.',
    drawingTitle: 'Как нарисовать иконку',
    drawingShapes:
      'Иконка — это данные, а не разметка. Её рисунок — список фигур: `stroke(d)` — контурный путь, `circle(cx, cy, r)` — контурный круг, `fillRect(x, y, width, height)` — залитая деталь, например точка восклицательного знака. `md` — рисунок 16×16, он обязателен. `sm` — необязательный рисунок 12×12 для иконок, которые при уменьшении до 12 px размываются или слипаются. Рисуйте его только там, где он действительно нужен.',
    drawingOriginal:
      'Рисуйте каждую иконку с нуля. Не копируйте, не обводите и не пересказывайте по координатам иконки Unity, Lucide, Material, Codicons и других наборов. Иконка рисует идею, а не чужую картинку.',
    drawingGrid:
      'Сетка 16×16 с полем в 1 пиксель: рабочая область — от 1 до 15. На сетке 12×12 — от 1 до 11.',
    drawingLines:
      'Толщина линий — 1 пиксель. Горизонтальные и вертикальные линии лежат на половинных координатах, например `x = 7.5`, чтобы закрывать ровно один ряд пикселей, а не размываться на два.',
    drawingEnds:
      'Концы линий квадратные, стыки острые. Линия от 3.5 до 11.5 полностью закрывает пиксели с 3 по 11.',
    drawingAxis: 'У симметричных иконок общая ось: пиксель 7, координата 7.5 (5.5 на сетке 12×12).',
    drawingCircles:
      'Крайние точки круга, `cx ± r` и `cy ± r`, лежат на половинных координатах. Диагонали по возможности идут под 45°, концы — в центрах пикселей.',
    drawingFills: 'Залитые детали — на целых координатах.',
    drawingWeight:
      'Фигуры одного визуального веса имеют разный размер: круг — 13 пикселей, квадрат — 11, глиф вроде крестика или шеврона — 9.',
    drawingCommands: 'В путях только абсолютные команды: `M`, `L`, `H`, `V`, `A` и `Z`.',
    drawingColors:
      'Цветов в рисунке нет. Компонент `Icon` красит линии и заливку через `currentColor`.',
    drawingCheck:
      '`findIconGeometryProblems` проверяет рабочую область, половинные координаты, круги, залитые детали и команды путей. Чёткость при 12 и 16 пикселях по-прежнему проверяется глазами в увеличенном виде выше.',
  },
});
