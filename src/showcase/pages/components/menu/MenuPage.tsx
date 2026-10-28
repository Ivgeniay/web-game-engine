import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { ContextMenuExample } from './ContextMenuExample';
import contextMenuStyles from './ContextMenuExample.module.css?raw';
import contextMenuSource from './ContextMenuExample.tsx?raw';
import { MenuItemKindsExample } from './MenuItemKindsExample';
import menuItemKindsStyles from './MenuItemKindsExample.module.css?raw';
import menuItemKindsSource from './MenuItemKindsExample.tsx?raw';
import { ToolbarMenuExample } from './ToolbarMenuExample';
import toolbarMenuStyles from './ToolbarMenuExample.module.css?raw';
import toolbarMenuSource from './ToolbarMenuExample.tsx?raw';

export function MenuPage() {
  return (
    <>
      <PageSection title="A menu on a button">
        <p>
          <code>Menu</code> shows a list of commands. Items are data, an array of{' '}
          <code>MenuItem</code>, not markup, so menus can be built from registries. The{' '}
          <code>trigger</code> function receives the props of the button that opens the menu; spread
          them on any primitive, including its <code>ref</code>. The menu is named after its trigger
          for screen readers.
        </p>
        <p>
          A press on the trigger opens the menu with the focus on the first available item. The
          example is a toolbar: the menu button stays part of the toolbar&apos;s arrow order, and
          the arrows inside the open menu move only through the menu.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'ToolbarMenuExample.tsx', code: toolbarMenuSource },
            { fileName: 'ToolbarMenuExample.module.css', code: toolbarMenuStyles },
          ]}
        >
          <ToolbarMenuExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Kinds of items">
        <p>
          Every item has a unique <code>id</code> and a <code>kind</code>:
        </p>
        <ul>
          <li>
            <code>action</code> runs <code>onSelect</code>; it may have an <code>icon</code>, a{' '}
            <code>shortcut</code> string and <code>disabled</code>;
          </li>
          <li>
            <code>checkbox</code> shows a check mark for <code>checked</code> and reports the
            switched value to <code>onCheckedChange</code>;
          </li>
          <li>
            <code>radio-group</code> is a group of <code>options</code> with one chosen{' '}
            <code>value</code>, reported to <code>onValueChange</code>;
          </li>
          <li>
            <code>submenu</code> holds nested <code>items</code> and opens on hover, with a short
            delay and a corridor for the pointer, or with Right;
          </li>
          <li>
            <code>separator</code> draws a line, <code>section</code> a small heading.
          </li>
        </ul>
        <p>
          Choosing any item closes the whole menu, and the focus returns to the trigger. The
          shortcut is only shown: running commands by shortcuts is the job of the shortcut
          mechanism.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'MenuItemKindsExample.tsx', code: menuItemKindsSource },
            { fileName: 'MenuItemKindsExample.module.css', code: menuItemKindsStyles },
          ]}
        >
          <MenuItemKindsExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="A menu at a point">
        <p>
          Without a trigger, a menu opens at a point on the screen: pass <code>point</code> with{' '}
          <code>x</code> and <code>y</code> in viewport coordinates, a <code>label</code> for screen
          readers and <code>onClose</code>. The menu is open while the point is set, and{' '}
          <code>onClose</code> asks to clear it. This is the base of context menus: set the point in
          an <code>onContextMenu</code> handler. After closing, the focus returns to where it was.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'ContextMenuExample.tsx', code: contextMenuSource },
            { fileName: 'ContextMenuExample.module.css', code: contextMenuStyles },
          ]}
        >
          <ContextMenuExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Keyboard">
        <ul>
          <li>Enter, Space and Down open a menu from its trigger.</li>
          <li>
            Up and Down move through the items and wrap around the ends, Home and End go to the
            first and the last item. Disabled items are skipped. Typing the first letters of an item
            moves to it.
          </li>
          <li>Enter and Space choose the item.</li>
          <li>Right opens a submenu, Left and Esc close the current level.</li>
          <li>A click outside closes the menu.</li>
        </ul>
      </PageSection>
      <PageSection title="Control from outside">
        <p>
          By default a menu with a trigger keeps its open state itself. Pass <code>open</code> and{' '}
          <code>onOpenChange</code> to decide it from outside, for example to switch between the
          menus of a menu bar. <code>onOpenChange</code> also works alone, as a notification.
        </p>
        <p>
          <code>onNavigateOut</code> is called with <code>previous</code> or <code>next</code> when
          Left or Right is pressed on the top level of a menu where they have no meaning of their
          own: Right on an item without a submenu, Left anywhere on the top level. A menu bar uses
          it to move to the neighbouring menu.
        </p>
      </PageSection>
    </>
  );
}
