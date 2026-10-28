import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { RovingFocusGroupExample } from './RovingFocusGroupExample';
import rovingFocusGroupStyles from './RovingFocusGroupExample.module.css?raw';
import rovingFocusGroupSource from './RovingFocusGroupExample.tsx?raw';
import { RovingFocusItemExample } from './RovingFocusItemExample';
import rovingFocusItemStyles from './RovingFocusItemExample.module.css?raw';
import rovingFocusItemSource from './RovingFocusItemExample.tsx?raw';

export function RovingFocusPage() {
  return (
    <>
      <PageSection title="How it works">
        <p>
          Roving focus makes a group of controls a single Tab stop. Tab enters the group on one
          item, arrow keys move between the items, and the next Tab leaves the group. Toolbar,
          ToggleButtonGroup and RadioGroup are built on it, and so will be Tabs and Breadcrumbs.
        </p>
        <ul>
          <li>
            Arrow keys follow the orientation: Left and Right in a horizontal group, Up and Down in
            a vertical one. Home and End go to the first and the last item.
          </li>
          <li>
            By default the focus wraps from the last item to the first. Pass{' '}
            <code>loop: false</code> to stop at the ends.
          </li>
          <li>Disabled items are skipped.</li>
          <li>
            Tab returns to the item focused last. Before that it lands on a preferred item, such as
            the selected option, and otherwise on the first enabled item.
          </li>
          <li>
            Text fields inside a group keep the arrow keys for the caret. An item that handles an
            arrow key itself calls <code>event.preventDefault()</code>, and the group leaves that
            key alone.
          </li>
        </ul>
      </PageSection>
      <PageSection title="A group of buttons">
        <p>
          <code>useRovingFocusGroup</code> returns the group <code>registry</code> and an{' '}
          <code>onKeyDown</code> handler. Pass the registry to <code>RovingFocusContext</code>, put
          the handler on the group element and give the element a role and a label. Button,
          IconButton and ToggleButton join the nearest group by themselves and behave as ordinary
          buttons outside of one.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'RovingFocusGroupExample.tsx', code: rovingFocusGroupSource },
            { fileName: 'RovingFocusGroupExample.module.css', code: rovingFocusGroupStyles },
          ]}
        >
          <RovingFocusGroupExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Custom items">
        <p>
          Any focusable element joins a group through <code>useRovingFocusItem</code>. It takes the
          element&apos;s own <code>ref</code>, <code>tabIndex</code> and <code>onFocus</code>, and
          returns them merged with the group&apos;s, ready to spread on the element.{' '}
          <code>disabled</code> takes the item out of the arrow order, <code>preferred</code> makes
          it the first Tab stop.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'RovingFocusItemExample.tsx', code: rovingFocusItemSource },
            { fileName: 'RovingFocusItemExample.module.css', code: rovingFocusItemStyles },
          ]}
        >
          <RovingFocusItemExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Nested groups">
        <p>
          With <code>joinParentGroup: true</code> a group inside another group does not start its
          own: its items join the outer one. ToggleButtonGroup does this, so inside a toolbar its
          buttons are part of the toolbar&apos;s arrow order and the toolbar stays one Tab stop.
          Without the option the inner group keeps its own Tab stop and arrow keys.
        </p>
        <p>
          <code>onNavigate</code> is called with the element the arrow key moved to. RadioGroup uses
          it to select the option that receives the focus.
        </p>
      </PageSection>
    </>
  );
}
