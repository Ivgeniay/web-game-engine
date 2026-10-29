import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { ComponentHeaderExample } from './ComponentHeaderExample';
import componentHeaderStyles from './ComponentHeaderExample.module.css?raw';
import componentHeaderSource from './ComponentHeaderExample.tsx?raw';

export function ComponentHeaderPage() {
  return (
    <>
      <PageSection title="The title of an inspector section">
        <p>
          <code>ComponentHeader</code> is the header of a component in the inspector, and it wraps
          the component&apos;s content as its children. It collapses like a <code>Foldout</code>:{' '}
          <code>expanded</code> with <code>onExpandedChange</code>, a click on the arrow, the title
          or the empty part of the header, and Alt+click for the nested groups.
        </p>
        <p>The other parts are optional and come in pairs of a handler and a ready text:</p>
        <ul>
          <li>
            <code>icon</code> after the arrow;
          </li>
          <li>
            <code>enabled</code> with <code>onEnabledChange</code> and <code>enabledLabel</code>{' '}
            shows the checkbox that switches the component on and off, as on Light or Rigidbody;
          </li>
          <li>
            <code>onHelp</code> with <code>helpLabel</code> shows the help button;
          </li>
          <li>
            <code>menuItems</code> with <code>menuLabel</code> shows the menu button. A right click
            on the header, Shift+F10 and the context menu key open the same menu.
          </li>
        </ul>
        <p>
          The header does not know what the menu holds. An integration builds the items, for example
          from the context menu registry of the editor. Clicks on the checkbox and the buttons do
          not collapse the section.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'ComponentHeaderExample.tsx', code: componentHeaderSource },
            { fileName: 'ComponentHeaderExample.module.css', code: componentHeaderStyles },
          ]}
        >
          <ComponentHeaderExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Keyboard">
        <p>
          The collapse toggle, the checkbox and each button are separate Tab stops. The toggle is
          named by the title. Enter and Space toggle the section, Right expands and Left collapses
          it. After the menu closes, the focus returns where it was.
        </p>
      </PageSection>
    </>
  );
}
