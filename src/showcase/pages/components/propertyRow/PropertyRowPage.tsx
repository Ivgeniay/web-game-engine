import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { PropertyRowExample } from './PropertyRowExample';
import propertyRowStyles from './PropertyRowExample.module.css?raw';
import propertyRowSource from './PropertyRowExample.tsx?raw';
import { PropertyRowSlotsExample } from './PropertyRowSlotsExample';
import propertyRowSlotsStyles from './PropertyRowSlotsExample.module.css?raw';
import propertyRowSlotsSource from './PropertyRowSlotsExample.tsx?raw';

export function PropertyRowPage() {
  return (
    <>
      <PageSection title="Caption and field">
        <p>
          A property row is the inspector line &quot;caption — field&quot;. It takes the caption as{' '}
          <code>label</code> and draws the field with a function in <code>children</code>: the
          function receives <code>id</code> for the field and <code>labelId</code> of the caption.
          Give <code>id</code> to the field so a click on the caption focuses it and screen readers
          read the caption as the field name. Fields named with <code>aria-labelledby</code>, such
          as Checkbox and Select, get <code>labelId</code> as well. The caption is not a Tab stop.
        </p>
        <p>
          <code>drag</code> makes the caption a drag zone for a number, as in Unity: drag the
          captions of Mass and Solver iterations. The drag target is the same as in{' '}
          <code>useValueDrag</code>, and its <code>onValueChange</code> usually is the same handler
          as the field&apos;s, since both speak the same protocol.
        </p>
        <p>
          <code>PropertyRowGroup</code> lines up the rows of a window or a section: the caption
          column has one width for all of them, 40% by default, and the border between the columns
          can be dragged. The width stays within the <code>--size-property-*</code> limits and is
          not saved between sessions. A row outside a group uses the default width.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'PropertyRowExample.tsx', code: propertyRowSource },
            { fileName: 'PropertyRowExample.module.css', code: propertyRowStyles },
          ]}
        >
          <PropertyRowExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Depth, slots and the property menu">
        <p>
          <code>depth</code> indents the caption of a nested property; fields stay in one column.{' '}
          <code>leading</code> is a slot left of the caption for a mark such as &quot;value
          changed&quot;, and <code>trailing</code> is a slot right of the field for a button such as
          &quot;reset&quot;.
        </p>
        <p>
          <code>menuItems</code> gives the property menu: a right click on the row, or the context
          menu key and Shift+F10 on a field that is not a text input, opens it. The row does not
          build the menu itself, the items come from the owner as data of the Menu component. Text
          inputs keep the browser&apos;s own menu with copy and paste.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'PropertyRowSlotsExample.tsx', code: propertyRowSlotsSource },
            { fileName: 'PropertyRowSlotsExample.module.css', code: propertyRowSlotsStyles },
          ]}
        >
          <PropertyRowSlotsExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Other props">
        <p>
          <code>disabled</code> shows the caption in the disabled color and turns off the drag; the
          field itself is disabled by its own prop. <code>className</code> goes to the row and is
          meant only for layout.
        </p>
      </PageSection>
    </>
  );
}
