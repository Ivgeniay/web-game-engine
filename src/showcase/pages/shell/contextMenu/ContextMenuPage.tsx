import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { ContextMenuExample } from './ContextMenuExample';
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
    </>
  );
}
