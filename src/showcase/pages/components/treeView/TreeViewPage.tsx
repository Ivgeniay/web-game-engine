import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { TreeViewControlledExample } from './TreeViewControlledExample';
import treeViewControlledStyles from './TreeViewControlledExample.module.css?raw';
import treeViewControlledSource from './TreeViewControlledExample.tsx?raw';
import { TreeViewExample } from './TreeViewExample';
import treeViewStyles from './TreeViewExample.module.css?raw';
import treeViewSource from './TreeViewExample.tsx?raw';
import { TreeViewLargeExample } from './TreeViewLargeExample';
import treeViewRenameStyles from './TreeViewRenameExample.module.css?raw';
import treeViewRenameSource from './TreeViewRenameExample.tsx?raw';
import { TreeViewRenameExample } from './TreeViewRenameExample';
import treeViewSearchStyles from './TreeViewSearchExample.module.css?raw';
import treeViewSearchSource from './TreeViewSearchExample.tsx?raw';
import { TreeViewSearchExample } from './TreeViewSearchExample';
import treeViewLargeStyles from './TreeViewLargeExample.module.css?raw';
import treeViewLargeSource from './TreeViewLargeExample.tsx?raw';

export function TreeViewPage() {
  return (
    <>
      <PageSection title="A tree over your data">
        <p>
          <code>TreeView</code> does not copy the tree. It reads it through a <code>TreeModel</code>
          : <code>rootIds</code>, <code>getChildren</code>, <code>hasChildren</code>,{' '}
          <code>getLabel</code> and the optional <code>getIcon</code>. The tree asks only for the
          children of expanded nodes. When the data changes, pass a new model object, for example
          one built with <code>useMemo</code> from a store snapshot.
        </p>
        <p>
          The tree is a <code>ListView</code> over the visible nodes, so the selection, the focused
          row, the keyboard and the mouse work as described on the ListView page. On top of that,
          the expanded nodes are controlled: <code>expandedIds</code> with{' '}
          <code>onExpandedIdsChange</code>. <code>useTreeViewState</code> holds all three parts when
          the owner does not need them. A selected node stays selected while its parent is
          collapsed.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'TreeViewExample.tsx', code: treeViewSource },
            { fileName: 'TreeViewExample.module.css', code: treeViewStyles },
          ]}
        >
          <TreeViewExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Ten thousand rows">
        <p>
          A hundred groups of a hundred objects, all expanded. Like the list, the tree draws only
          the rows in view, and expanding or collapsing a group rebuilds the list of visible nodes
          without touching the hidden ones.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'TreeViewLargeExample.tsx', code: treeViewLargeSource },
            { fileName: 'TreeViewLargeExample.module.css', code: treeViewLargeStyles },
          ]}
        >
          <TreeViewLargeExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Expanded nodes and icons">
        <p>
          The owner may keep <code>expandedIds</code> itself, for example to save them with the
          window or to expand everything from a command. <code>getIcon</code> receives the expanded
          state, so a folder can show an open icon. <code>renderRow</code> replaces the icon and the
          label like in <code>ListView</code> and also receives <code>depth</code>,{' '}
          <code>hasChildren</code>, <code>expanded</code> and <code>match</code>, the range of the
          search match to pass to <code>ListRowContent</code> as <code>highlight</code>. The indent
          and the arrow stay with the tree. A double click starts renaming only on an element with
          the <code>data-list-row-label</code> attribute, which <code>ListRowContent</code> puts on
          its label.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'TreeViewControlledExample.tsx', code: treeViewControlledSource },
            { fileName: 'TreeViewControlledExample.module.css', code: treeViewControlledStyles },
          ]}
        >
          <TreeViewControlledExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Renaming">
        <p>
          With <code>onRename</code>, F2 (Enter on macOS) or a double click on the label turns the
          row into a field. The field follows the value protocol of the other fields: Enter and
          leaving the field commit, Esc cancels and does not close a dialog around the tree.{' '}
          <code>onRename</code> is called only with a changed, valid name; the owner changes the
          data and passes a new model, the tree does not keep the name.
        </p>
        <p>
          <code>validateName</code> returns the message for an invalid name, and the field shows it
          while typing; an invalid name is not committed. <code>renameLabel</code> names the field
          for screen readers. The row being renamed is controlled too: <code>renamingId</code> with{' '}
          <code>onRenamingIdChange</code>, so a context menu command can start renaming. After Enter
          or Esc the focus returns to the tree.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'TreeViewRenameExample.tsx', code: treeViewRenameSource },
            { fileName: 'TreeViewRenameExample.module.css', code: treeViewRenameStyles },
          ]}
        >
          <TreeViewRenameExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Search">
        <p>
          <code>filter</code> shows the nodes whose label contains the text, ignoring the case,
          together with their ancestors. The search looks into collapsed nodes too. The ancestors
          are expanded, and the match in the label is underlined. Children of a match that do not
          match are hidden.
        </p>
        <p>
          While the filter is on, expanding and collapsing change only the view of the results, not{' '}
          <code>expandedIds</code>. When the filter is cleared, the tree expands the ancestors of
          the selected node through <code>onExpandedIdsChange</code>, focuses it and scrolls to it,
          so the found object stays in view.
        </p>
        <p>
          Put a <code>SearchField</code> above the tree and pass the tree&apos;s <code>ref</code> as{' '}
          <code>resultsRef</code>: Down in the field moves the focus to the tree.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'TreeViewSearchExample.tsx', code: treeViewSearchSource },
            { fileName: 'TreeViewSearchExample.module.css', code: treeViewSearchStyles },
          ]}
        >
          <TreeViewSearchExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Keyboard and mouse">
        <ul>
          <li>All keys of ListView: arrows, Home, End, pages, Shift, Ctrl (⌘), Ctrl+A, letters.</li>
          <li>
            Right expands a collapsed node, and on an expanded node moves to its first child. Left
            collapses an expanded node, and on other nodes moves to the parent.
          </li>
          <li>Alt+Right and Alt+Left expand and collapse the node with its whole subtree.</li>
          <li>
            F2 (Enter on macOS) renames the focused row when the tree has <code>onRename</code>.
          </li>
          <li>
            A click on the arrow expands or collapses the node without selecting it. Alt+click does
            the same for the whole subtree.
          </li>
          <li>
            When collapsing hides the focused row, the focus moves to the collapsed node, and the
            selection does not change.
          </li>
        </ul>
        <p>
          Each row has <code>aria-level</code>, <code>aria-posinset</code>,{' '}
          <code>aria-setsize</code> and, for nodes with children, <code>aria-expanded</code>, so
          screen readers announce the structure although the rows are drawn as a flat list. The
          indent of a level is the <code>--size-tree-indent</code> token.
        </p>
      </PageSection>
    </>
  );
}
