import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { ContextMenuExample } from './ContextMenuExample';
import { ContextMenuItemsExample } from './ContextMenuItemsExample';
import contextMenuItemsStyles from './ContextMenuItemsExample.module.css?raw';
import contextMenuItemsSource from './ContextMenuItemsExample.tsx?raw';
import contextMenuStyles from './ContextMenuExample.module.css?raw';
import contextMenuSource from './ContextMenuExample.tsx?raw';

export function ContextMenuPage() {
  return (
    <>
      <PageSection title="Contexts">
        <p>
          A context menu is assembled from the registry by a context: an id plus the type of its
          target. <code>{"defineContextMenu<SceneObject>({ id: 'hierarchy.item', label })"}</code>{' '}
          declares the context once next to the code that shows it. The label is the accessible name
          of the menu.
        </p>
        <p>
          <code>contextMenus.registerItem(context, item)</code> and{' '}
          <code>contextMenus.registerMenu(context, menu)</code> take the same paths, groups and
          orders as the main menu, except that commands may sit at the root. Anyone can add items to
          any context, including the contexts of the framework: the lighting extension in the
          example adds Bake lighting to the objects of the hierarchy.
        </p>
      </PageSection>
      <PageSection title="Targets">
        <p>
          The item passes the target of the menu to its command. A command of the context target
          type, <code>{'defineCommand<SceneObject>'}</code>, receives the object in{' '}
          <code>invocation.target</code>, and its <code>isEnabled</code> can depend on it. A command
          without a target, such as Paste, is added with <code>withoutTarget: true</code> and
          receives <code>undefined</code>. The compiler rejects a command of another target type and
          a command without a target that is not marked.
        </p>
      </PageSection>
      <PageSection title="Opening">
        <p>
          <code>useContextMenu(context)</code> returns the state of one menu.{' '}
          <code>getTriggerProps(target)</code> gives the handlers for each element with that target,
          and <code>ContextMenu</code> draws the open menu. One menu serves a whole list.
        </p>
        <ul>
          <li>
            The menu opens on a right click at the pointer, and on Shift+F10 or the context menu key
            below the focused element.
          </li>
          <li>
            The innermost element wins: a row inside a panel opens the row menu, the empty space of
            the panel opens the panel menu.
          </li>
          <li>
            Text fields keep the native menu of the browser with copy and paste. Elsewhere in the
            editor <code>startNativeContextMenuSuppression(document)</code> in the entry point
            suppresses the native menu, even where no context menu is registered.
          </li>
          <li>A context without visible items opens nothing.</li>
        </ul>
        <ExampleBlock
          sources={[
            { fileName: 'ContextMenuExample.tsx', code: contextMenuSource },
            { fileName: 'ContextMenuExample.module.css', code: contextMenuStyles },
          ]}
        >
          <ContextMenuExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Items for a component">
        <p>
          A primitive with its own menu, such as <code>ComponentHeader</code>, takes ready{' '}
          <code>MenuItem</code> values and knows nothing about registries.{' '}
          <code>useContextMenuItems(context, target)</code> builds those items from the registry the
          same way <code>ContextMenu</code> does: hidden commands are left out, groups are
          separated, <code>isEnabled</code> and <code>isChecked</code> are asked about the target,
          and a command runs after the menu has closed. The items follow new registrations and{' '}
          <code>commands.refresh()</code>. Keep the target stable with <code>useMemo</code>.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'ContextMenuItemsExample.tsx', code: contextMenuItemsSource },
            { fileName: 'ContextMenuItemsExample.module.css', code: contextMenuItemsStyles },
          ]}
        >
          <ContextMenuItemsExample />
        </ExampleBlock>
      </PageSection>
    </>
  );
}
