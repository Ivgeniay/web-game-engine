import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { ToolbarStatusBarExample } from './ToolbarStatusBarExample';
import exampleStyles from './ToolbarStatusBarExample.module.css?raw';
import exampleSource from './ToolbarStatusBarExample.tsx?raw';

export function ToolbarStatusBarPage() {
  return (
    <>
      <PageSection title="Main toolbar">
        <p>
          <code>MainToolbar</code> draws the items of <code>editor.toolbar</code> in three zones:
          left, center and right. Inside a zone, items are sorted by <code>group</code> and{' '}
          <code>order</code>, with a separator between groups. An item is one of two kinds:
        </p>
        <ul>
          <li>
            <code>{"{ kind: 'command', id, zone, group, order, command }"}</code> shows a command. A
            command with an icon becomes an icon button with its label and shortcut in the tooltip,
            one without an icon becomes a text button. A command with <code>isChecked</code> becomes
            a toggle. A command without a handler is hidden.
          </li>
          <li>
            <code>{"{ kind: 'component', id, zone, group, order, component }"}</code> shows any
            component of the integration, such as the resolution list of the Game window. The
            component reads the engine state on its own.
          </li>
        </ul>
        <p>
          A disabled command stays in the toolbar as a focusable button with{' '}
          <code>aria-disabled</code>: the keyboard reaches it with the arrow keys, its tooltip
          explains what it is, and pressing it does nothing. Buttons get this behavior from the{' '}
          <code>focusableWhenDisabled</code> prop.
        </p>
      </PageSection>
      <PageSection title="Status bar">
        <p>
          <code>StatusBar</code> draws the items of <code>editor.statusBar</code> in the left and
          right zones, sorted by <code>order</code>. Each item is a component of the integration.
          Set <code>announce: true</code> for an item whose changes a screen reader should read out:
          it gets <code>role=&quot;status&quot;</code>. The others stay silent, so the reader does
          not read the whole bar on every change.
        </p>
      </PageSection>
      <PageSection title="Example">
        <p>
          The game extension registers Play, Pause and Step in the main menu and in the toolbar, a
          resolution list in the toolbar and two status bar items. The mock engine calls{' '}
          <code>commands.refresh()</code> on every change, so the menu item and the toolbar button
          of a command are disabled together: Pause is available only while the game is playing,
          Step only while it is paused. Switch the language: the labels change at once.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'ToolbarStatusBarExample.tsx', code: exampleSource },
            { fileName: 'ToolbarStatusBarExample.module.css', code: exampleStyles },
          ]}
        >
          <ToolbarStatusBarExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="The editor frame">
        <p>
          <code>EditorFrame</code> from <code>@/shell/EditorFrame</code> puts the parts together:
          the menu bar and the toolbar at the top, the status bar at the bottom and the workspace
          between them, where docking will go. It also hosts the confirm dialogs. The framework
          registers nothing by itself, so in the editor the menu and the toolbar stay empty until an
          integration fills them.
        </p>
      </PageSection>
    </>
  );
}
