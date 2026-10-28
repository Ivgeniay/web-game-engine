import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { IconExample } from './IconExample';
import iconStyles from './IconExample.module.css?raw';
import iconSource from './IconExample.tsx?raw';
import { IconFromDataExample } from './IconFromDataExample';
import iconFromDataStyles from './IconFromDataExample.module.css?raw';
import iconFromDataSource from './IconFromDataExample.tsx?raw';
import { IconGallery } from './IconGallery';
import { IntegrationIconsExample } from './IntegrationIconsExample';
import integrationIconsStyles from './IntegrationIconsExample.module.css?raw';
import integrationIconsSource from './IntegrationIconsExample.tsx?raw';

export function IconsPage() {
  return (
    <>
      <PageSection title="Framework icons">
        <p>
          Every icon of the framework at its two sizes: 16 px (<code>--size-icon-md</code>) and 12
          px (<code>--size-icon-sm</code>). Select an icon to see it enlarged on its pixel grid
          together with the code that uses it. The enlarged view is a real 1× raster of the icon, so
          a line that misses the pixel grid shows up as a blurred two-pixel line. Turn on the
          outline to see the geometry of the drawing on top of the raster. Use the theme switcher in
          the header to check the icons in both themes.
        </p>
        <p>
          An icon marked <code>12×12</code> has its own drawing for the small size. Other icons are
          scaled down from their 16×16 drawing.
        </p>
        <IconGallery />
      </PageSection>
      <PageSection title="Using an icon">
        <p>
          Icons come in sets. The framework set is <code>frameworkIcons</code> from{' '}
          <code>@/icons/frameworkIcons</code>. Pass an icon of a set to the <code>Icon</code>{' '}
          component from <code>@/ui/icon/Icon</code>. A set is a typed object, so a typo in an icon
          name is a compile error. <code>size</code> is <code>md</code> (16 px, the default) or{' '}
          <code>sm</code> (12 px).
        </p>
        <p>
          An icon takes the text color of its parent through <code>currentColor</code>, so color it
          by setting <code>color</code> on the parent. Status colors are allowed for icons. An icon
          is decorative: it is hidden from assistive technologies and has no label of its own. The
          label belongs to the button that holds the icon.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'IconExample.tsx', code: iconSource },
            { fileName: 'IconExample.module.css', code: iconStyles },
          ]}
        >
          <IconExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Icons in data">
        <p>
          Data written in code, such as a menu item registered by the integration, stores the icon
          itself: <code>{'{ icon: frameworkIcons.close }'}</code>. It is checked by the compiler.
        </p>
        <p>
          When the name of an icon arrives as a string, for example from a file or from the engine,
          store a reference with <code>iconRef(set, name)</code>: the set together with the name, as{' '}
          <code>messageRef</code> stores a dictionary together with a key. <code>Icon</code> accepts
          such a reference as well. If the set has no icon with that name, <code>Icon</code> shows
          the <code>unknown</code> placeholder and, in development, warns in the browser console.
          The interface keeps working. Below, <code>teleport</code> is such a missing name.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'IconFromDataExample.tsx', code: iconFromDataSource },
            { fileName: 'IconFromDataExample.module.css', code: iconFromDataStyles },
          ]}
        >
          <IconFromDataExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Integration icons">
        <p>
          There is no global list of icon names. The integration declares its own set in its own
          folder, for example <code>src/engine/icons/engineIcons.ts</code>, with the same{' '}
          <code>defineIcon</code> and <code>defineIcons</code> as the framework. Its icons are
          passed to <code>Icon</code> the same way and checked by the same types. No framework file
          has to change.
        </p>
        <p>
          Keep one icon per file, named after the icon, and collect them into a set in one file. The
          drawing rules below apply to integration icons too: run{' '}
          <code>findIconGeometryProblems</code> from <code>@/icons/iconGeometry</code> over your set
          in a test, as the framework does for its own icons.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'IntegrationIconsExample.tsx', code: integrationIconsSource },
            { fileName: 'IntegrationIconsExample.module.css', code: integrationIconsStyles },
          ]}
        >
          <IntegrationIconsExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Drawing an icon">
        <p>
          An icon is data, not markup. Its drawing is a list of shapes: <code>stroke(d)</code> is an
          outlined path, <code>circle(cx, cy, r)</code> an outlined circle and{' '}
          <code>fillRect(x, y, width, height)</code> a filled detail, such as the dot of an
          exclamation mark. <code>md</code> is the 16×16 drawing and is required. <code>sm</code> is
          an optional 12×12 drawing for icons that blur or merge when scaled down to 12 px. Draw it
          only where it is really needed.
        </p>
        <ul>
          <li>
            Draw every icon from scratch. Do not copy, trace or re-create by coordinates icons of
            Unity, Lucide, Material, Codicons or any other set. An icon draws an idea, not someone
            else’s picture.
          </li>
          <li>
            The grid is 16×16 with a 1 pixel margin: the working area is 1 to 15. On the 12×12 grid
            it is 1 to 11.
          </li>
          <li>
            Lines are 1 pixel thick. Horizontal and vertical lines lie on half coordinates, such as{' '}
            <code>x = 7.5</code>, so that they cover exactly one pixel row instead of blurring over
            two.
          </li>
          <li>
            Line ends are square and joins are mitered. A line from 3.5 to 11.5 covers pixels 3 to
            11 completely.
          </li>
          <li>
            Symmetric icons share one axis: pixel 7, the coordinate 7.5 (5.5 on the 12×12 grid).
          </li>
          <li>
            The extremes of a circle, <code>cx ± r</code> and <code>cy ± r</code>, lie on half
            coordinates. Diagonals go at 45° where possible, with ends on pixel centers.
          </li>
          <li>Filled details use whole coordinates.</li>
          <li>
            Shapes of the same visual weight have different sizes: a circle spans 13 pixels, a
            square 11, a glyph such as a cross or a chevron 9.
          </li>
          <li>
            Paths use absolute commands only: <code>M</code>, <code>L</code>, <code>H</code>,{' '}
            <code>V</code>, <code>A</code> and <code>Z</code>.
          </li>
          <li>
            There are no colors in a drawing. The <code>Icon</code> component paints strokes and
            fills with <code>currentColor</code>.
          </li>
        </ul>
        <p>
          <code>findIconGeometryProblems</code> checks the working area, half coordinates, circles,
          filled details and path commands. Sharpness at 12 and 16 pixels is still checked by eye in
          the enlarged view above.
        </p>
      </PageSection>
    </>
  );
}
