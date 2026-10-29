import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { ListViewCustomRowExample } from './ListViewCustomRowExample';
import listViewCustomRowStyles from './ListViewCustomRowExample.module.css?raw';
import listViewCustomRowSource from './ListViewCustomRowExample.tsx?raw';
import { ListViewExample } from './ListViewExample';
import listViewStyles from './ListViewExample.module.css?raw';
import listViewSource from './ListViewExample.tsx?raw';
import { ListViewLargeExample } from './ListViewLargeExample';
import listViewLargeStyles from './ListViewLargeExample.module.css?raw';
import listViewLargeSource from './ListViewLargeExample.tsx?raw';

export function ListViewPage() {
  return (
    <>
      <PageSection title="A list with a selection">
        <p>
          <code>ListView</code> does not copy the data. It takes <code>itemIds</code>, the ids of
          the rows in their order, and functions that read a row by its id: <code>getLabel</code>{' '}
          and the optional <code>getIcon</code>. Pass a new array when the rows change.
        </p>
        <p>
          The selection and the focused row are controlled: <code>selectedIds</code> with{' '}
          <code>onSelectedIdsChange</code> and <code>focusedId</code> with{' '}
          <code>onFocusedIdChange</code>. When the owner does not need to keep them anywhere,{' '}
          <code>useListViewState</code> holds them and returns the four props to spread on the list.
          The selected ids come in the order of the rows.
        </p>
        <p>
          <code>selectionMode</code> is <code>single</code> by default. In the <code>multiple</code>{' '}
          mode, Ctrl (⌘ on macOS) adds or removes a row, Shift selects a range from the last clicked
          row, and both together add a range. A click on the empty space below the rows clears the
          selection. A right click on a row that is not selected selects it, so a context menu acts
          on the row that was clicked.
        </p>
        <p>
          The selection is drawn with <code>bg-selection</code> while the focus is in the list and
          with <code>bg-selection-inactive</code> otherwise, so the active window stands out. Name
          the list with <code>aria-label</code> and give it a height: it scrolls inside its own box.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'ListViewExample.tsx', code: listViewSource },
            { fileName: 'ListViewExample.module.css', code: listViewStyles },
          ]}
        >
          <ListViewExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Thousands of rows">
        <p>
          The list draws only the rows in view and a few rows above and below them, so ten thousand
          rows scroll as fast as ten. Every row has the same height, the{' '}
          <code>--size-list-row-height</code> token. The focused row stays in the document while it
          is scrolled away, so screen readers can still read it.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'ListViewLargeExample.tsx', code: listViewLargeSource },
            { fileName: 'ListViewLargeExample.module.css', code: listViewLargeStyles },
          ]}
        >
          <ListViewLargeExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="A custom row">
        <p>
          <code>renderRow</code> draws the inside of a row. It receives the row state:{' '}
          <code>id</code>, <code>index</code>, <code>label</code>, <code>selected</code> and{' '}
          <code>focused</code>. The list still draws the row box, its height, the selection and the
          focus. <code>ListRowContent</code> is the standard icon and label, so a custom row can add
          its own parts next to them, like the time in the example.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'ListViewCustomRowExample.tsx', code: listViewCustomRowSource },
            { fileName: 'ListViewCustomRowExample.module.css', code: listViewCustomRowStyles },
          ]}
        >
          <ListViewCustomRowExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Keyboard">
        <ul>
          <li>
            The list is one Tab stop. The focus stays on the list, and the focused row is announced
            through <code>aria-activedescendant</code>. Without a focused row, the list focuses the
            first selected row or the first row.
          </li>
          <li>
            Up, Down, Home, End, Page Up and Page Down move the focus and select the row. With Shift
            they extend the selection from the anchor. With Ctrl (⌘) they move only the focus, and
            Ctrl+Space (⌘+Space) adds or removes the focused row.
          </li>
          <li>Ctrl+A (⌘A) selects all rows in the multiple mode.</li>
          <li>
            Typing the first letters of a label moves to the row. Typing the same letter again moves
            to the next row that starts with it.
          </li>
        </ul>
        <p>
          The list joins the arrow order of a <code>Toolbar</code> or another roving focus group
          like any focusable control. <code>id</code>, <code>ref</code>, <code>className</code> and
          other attributes apply to the scrolling box.
        </p>
      </PageSection>
    </>
  );
}
