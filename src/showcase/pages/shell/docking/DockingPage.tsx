import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { OpenWindowsExample } from './OpenWindowsExample';
import openWindowsStyles from './OpenWindowsExample.module.css?raw';
import openWindowsSource from './OpenWindowsExample.tsx?raw';
import { WindowCommandsExample } from './WindowCommandsExample';
import windowCommandsStyles from './WindowCommandsExample.module.css?raw';
import windowCommandsSource from './WindowCommandsExample.tsx?raw';

export function DockingPage() {
  return (
    <>
      <PageSection title="Window types">
        <p>
          The framework has no windows of its own. The integration describes each kind of window
          once, at module level, with{' '}
          <code>{'defineWindow({ id, title, icon?, component, multiInstance? })'}</code>, and
          registers it at startup with <code>windows.register(windowType)</code>. Registration
          returns its cancellation, like every registry of the editor.
        </p>
        <ul>
          <li>
            <code>id</code> is prefixed with its part, <code>demo.hierarchy</code>. It is also the
            hotkey scope of the window.
          </li>
          <li>
            <code>title</code> is a <code>MessageRef</code>. Tabs translate it when they render, so
            they follow the language without a reload.
          </li>
          <li>
            <code>component</code> is an ordinary component. It receives <code>windowId</code>, the
            id of its instance.
          </li>
          <li>
            A window is single-instance by default. A multi-instance window gets ids with a number:{' '}
            <code>example.inspector:1</code>, <code>example.inspector:2</code>.
          </li>
        </ul>
      </PageSection>
      <PageSection title="Opening and closing">
        <p>
          <code>DockLayout</code> shows the windows. <code>EditorFrame</code> puts it into the
          workspace between the toolbar and the status bar. Code talks to it through{' '}
          <code>workspace</code> of the editor registries:
        </p>
        <ul>
          <li>
            <code>workspace.open(windowType)</code> adds the window to the active group and focuses
            it. A single-instance window that is already open is activated instead. The method
            returns the id of the window, or <code>null</code> while no dock layout is mounted.
          </li>
          <li>
            <code>workspace.close(windowId)</code> closes a window,{' '}
            <code>workspace.isOpen(windowType)</code> tells whether one is open.
          </li>
          <li>
            <code>workspace.getActiveWindow()</code> returns the active window,{' '}
            <code>workspace.subscribe</code> and <code>workspace.getVersion</code> follow changes.
          </li>
        </ul>
        <p>
          Tabs are dragged between groups, a tab dropped at the edge of a group splits it, and the
          dividers between groups are dragged with the mouse. Floating windows and moving a window
          into a separate browser window are turned off.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'OpenWindowsExample.tsx', code: openWindowsSource },
            { fileName: 'OpenWindowsExample.module.css', code: openWindowsStyles },
          ]}
        >
          <OpenWindowsExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Active window and hotkeys">
        <p>
          The active window is the one that holds the focus. A click on an empty place of a window
          moves the focus into the window, a click on a tab focuses its window. The tab of the
          active window is marked with a line in the accent color.
        </p>
        <p>
          Every window is a hotkey scope with the id of its type. A command with{' '}
          <code>{"shortcut: { keys: 'KeyF', scope: 'example.scene' }"}</code> works only while the
          focus is inside a Scene window. A window brings its commands for its lifetime with{' '}
          <code>useRegistration</code>, the same way as any other component.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'WindowCommandsExample.tsx', code: windowCommandsSource },
            { fileName: 'WindowCommandsExample.module.css', code: windowCommandsStyles },
          ]}
        >
          <WindowCommandsExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Look">
        <p>
          Dockview is styled with the tokens of the framework: backgrounds, tabs, dividers, the drop
          highlight <code>overlay-drop-target</code>, the font and <code>--size-tab-height</code>.
          The tokens live on <code>:root</code>, so switching the theme restyles the docking at
          once. The internal layers of dockview are isolated inside <code>DockLayout</code> and do
          not compete with the popup layer.
        </p>
      </PageSection>
    </>
  );
}
