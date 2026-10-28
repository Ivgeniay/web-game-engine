import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { MenuBarExample } from './MenuBarExample';
import menuBarStyles from './MenuBarExample.module.css?raw';
import menuBarSource from './MenuBarExample.tsx?raw';

export function MenuBarPage() {
  return (
    <>
      <PageSection title="Registering menus and items">
        <p>
          The framework puts nothing into the main menu. Whoever registers decides which top menus
          exist, in which order and with which labels. Entries are registered by path, like{' '}
          <code>MenuItem</code> in Unity, but the path is made of ids, not labels, because labels
          are <code>MessageRef</code> and change with the language.
        </p>
        <ul>
          <li>
            <code>mainMenu.registerMenu({'{ path, label, group, order }'})</code> registers a top
            menu (<code>file</code>) or a submenu (<code>file/export</code>).
          </li>
          <li>
            <code>mainMenu.registerItem({'{ path, command, group, order }'})</code> puts a command
            into a menu: <code>file/save</code>. An item needs a parent menu, and an item whose
            parent is not registered is not shown.
          </li>
          <li>
            Inside one level, entries are sorted by <code>group</code>, then by <code>order</code>,
            then by registration. A separator is drawn between groups.
          </li>
          <li>
            Every registration returns its cancel function. A duplicate path or an invalid path is
            an error.
          </li>
        </ul>
        <p>
          An item refers to the command definition. Its label, icon and shortcut come from the
          command, and its availability and check mark come from the handler when the menu opens. A
          command without a handler hides its item, and a menu without visible items is hidden as
          well. A command with <code>isChecked</code> becomes a check item.
        </p>
      </PageSection>
      <PageSection title="Example">
        <p>
          The engine integration registers File, Edit and View with their commands. A second
          extension, like a plugin, adds Publish to the existing File menu without touching the
          engine code. Undo is available only after a change of the mock scene. Switch the language
          in the header: the labels change at once.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'MenuBarExample.tsx', code: menuBarSource },
            { fileName: 'MenuBarExample.module.css', code: menuBarStyles },
          ]}
        >
          <MenuBarExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Keyboard and mouse">
        <ul>
          <li>
            F10 moves the focus to the first menu, and on Windows and Linux so does a single tap of
            Alt. Alt with another key, AltGr or a mouse button does not count. Pass{' '}
            <code>{'altKeyActivates={false}'}</code> to switch Alt off. On macOS only F10 works.
            Neither works while a dialog or a menu is open.
          </li>
          <li>Left and right move between menus, Down, Enter and Space open the focused one.</li>
          <li>
            While a menu is open, left and right open the neighboring menu, and hovering another
            menu opens it.
          </li>
          <li>
            Escape closes the menu; on a closed menu it returns the focus to where it was before F10
            or Alt. F10 or Alt in the menu bar does the same.
          </li>
          <li>
            The command runs after the menu has closed and returned the focus, so a command may open
            a dialog.
          </li>
        </ul>
      </PageSection>
    </>
  );
}
