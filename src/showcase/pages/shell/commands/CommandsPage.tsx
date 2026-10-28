import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { CommandAtStartupExample } from './CommandAtStartupExample';
import commandAtStartupStyles from './CommandAtStartupExample.module.css?raw';
import commandAtStartupSource from './CommandAtStartupExample.tsx?raw';
import { LifetimeCommandExample } from './LifetimeCommandExample';
import lifetimeCommandStyles from './LifetimeCommandExample.module.css?raw';
import lifetimeCommandSource from './LifetimeCommandExample.tsx?raw';

export function CommandsPage() {
  return (
    <>
      <PageSection title="Definitions and handlers">
        <p>
          A command is split in two parts. The <strong>definition</strong> is data: an id, a label
          and an optional icon and default shortcut. <code>defineCommand</code> creates it once at
          module level. The <strong>handler</strong> is behavior: <code>run</code>, and optionally{' '}
          <code>isEnabled</code> and <code>isChecked</code>. Whoever can execute the command
          registers the handler: the engine integration at startup or a window while it is open.
        </p>
        <p>
          Menu items and toolbar buttons refer to the definition object, not to an id string, so a
          typo is a compile error. A command without a registered handler is hidden wherever it is
          referenced.
        </p>
        <ul>
          <li>
            <code>id</code> is unique in the editor. Use a prefix of your part:{' '}
            <code>scene.save</code>, <code>inspector.lock</code>. It is also the key for the future
            user remapping of shortcuts.
          </li>
          <li>
            <code>label</code> is a <code>MessageRef</code>, so labels follow the language without a
            reload.
          </li>
          <li>
            <code>shortcut</code> is written with physical key codes:{' '}
            <code>{"{ keys: 'Mod+Shift+KeyS' }"}</code>. <code>Mod</code> is Ctrl on Windows and
            Linux and ⌘ on macOS. The modifiers go in the order <code>Mod</code>, <code>Alt</code>,{' '}
            <code>Shift</code>, and the compiler rejects any other order or an unknown key.
          </li>
        </ul>
      </PageSection>
      <PageSection title="Registries and the integration entry point">
        <p>
          The registries of the editor are created by <code>createEditorRegistries</code> in the
          entry point and passed down with <code>RegistriesProvider</code>, just like the theme and
          language stores. There are no global registries: a test or an example creates its own
          isolated set. Components reach the registries with <code>useEditorRegistries</code>.
        </p>
        <p>
          An integration connects through one function of the <code>EditorExtension</code> type from{' '}
          <code>@/contracts/editorExtension</code>. It receives the registries, registers its
          elements and returns a function that cancels all of them. Every <code>register</code> or{' '}
          <code>handle</code> call returns its own cancel function; join several with{' '}
          <code>combineUnsubscribes</code> from <code>@/core/unsubscribe</code>.
        </p>
      </PageSection>
      <PageSection title="Availability at the moment of display">
        <p>
          <code>isEnabled</code> and <code>isChecked</code> are evaluated when the command is shown:
          when a menu opens and when a toolbar button renders. A menu item and a button of the same
          command read the same handler, so they become disabled together.
        </p>
        <p>
          A toolbar is always on screen, so it has to learn when the engine state changes. Call{' '}
          <code>commands.refresh()</code> after such a change: every component that shows a command
          through <code>useCommandState</code> evaluates it again. Registering or removing a handler
          refreshes them by itself.
        </p>
        <p>
          In the example the integration handles <code>scene.save</code> at startup. The command is
          available only while the mock scene has changes, and the button follows it.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'CommandAtStartupExample.tsx', code: commandAtStartupSource },
            { fileName: 'CommandAtStartupExample.module.css', code: commandAtStartupStyles },
          ]}
        >
          <CommandAtStartupExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Registering for the lifetime of a component">
        <p>
          A window that brings its own commands registers them with <code>useRegistration</code>.
          The registration lives while the component is mounted and is cancelled when it unmounts.
          The second argument lists the values the registration depends on, as in{' '}
          <code>useEffect</code>, and the linter checks it the same way. When a value changes, the
          registration is replaced.
        </p>
        <p>
          Hide the Inspector window in the example: its handler is gone, so the button disappears.
          The lock state lives in the window, and <code>isChecked</code> shows it on the toggle
          outside the window.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'LifetimeCommandExample.tsx', code: lifetimeCommandSource },
            { fileName: 'LifetimeCommandExample.module.css', code: lifetimeCommandStyles },
          ]}
        >
          <LifetimeCommandExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Invocation and targets">
        <p>
          <code>run</code>, <code>isEnabled</code> and <code>isChecked</code> receive the
          invocation: <code>source</code> tells where the command was invoked from (
          <code>menu</code>, <code>context-menu</code>, <code>toolbar</code>, <code>hotkey</code> or{' '}
          <code>code</code>), and <code>target</code> carries the data of the context menu target.
        </p>
        <p>
          A command that needs a target declares its type:{' '}
          <code>{'defineCommand<SceneObject>(…)'}</code>. Such a command can be invoked only from a
          context menu of the same target type, and it cannot have a shortcut: the compiler rejects
          both mistakes. A command without a target has <code>target: undefined</code> and works
          everywhere.
        </p>
      </PageSection>
      <PageSection title="Errors">
        <ul>
          <li>
            A second handler for a command id that already has one is an error. In development it
            throws, in production it is logged and the second handler is ignored. Two windows of the
            same kind must share one handler.
          </li>
          <li>Two different definitions with the same id are an error in the same way.</li>
          <li>
            If <code>run</code> returns a promise that rejects, the error is logged with the command
            id.
          </li>
        </ul>
      </PageSection>
    </>
  );
}
