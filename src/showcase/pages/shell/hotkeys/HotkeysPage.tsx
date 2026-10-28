import { formatShortcut } from '@/core/hotkeys/formatShortcut';
import { PLATFORMS } from '@/core/hotkeys/platform';
import type { Platform } from '@/core/hotkeys/platform';
import { RESERVED_SHORTCUTS } from '@/core/hotkeys/reservedShortcuts';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { Kbd } from '@/ui/kbd/Kbd';
import { HotkeyScopesExample } from './HotkeyScopesExample';
import hotkeyScopesStyles from './HotkeyScopesExample.module.css?raw';
import hotkeyScopesSource from './HotkeyScopesExample.tsx?raw';
import styles from './HotkeysPage.module.css';
import { ShortcutFormatExample } from './ShortcutFormatExample';
import shortcutFormatStyles from './ShortcutFormatExample.module.css?raw';
import shortcutFormatSource from './ShortcutFormatExample.tsx?raw';

const PLATFORM_NAMES: Readonly<Record<Platform, string>> = {
  other: 'Windows and Linux:',
  mac: 'macOS:',
};

export function HotkeysPage() {
  return (
    <>
      <PageSection title="Declaring a shortcut">
        <p>
          A shortcut belongs to a command: <code>{"shortcut: { keys: 'Mod+Shift+KeyZ' }"}</code>.
          The key is a <code>KeyboardEvent.code</code> value such as <code>KeyZ</code>,{' '}
          <code>Digit1</code>, <code>F2</code> or <code>Delete</code>. The modifiers are{' '}
          <code>Mod</code>, <code>Alt</code> and <code>Shift</code>, always in this order.{' '}
          <code>Mod</code> is Ctrl on Windows and Linux and ⌘ on macOS, like <code>%</code> in Unity
          menu paths. A separate Control modifier on macOS is not supported yet.
        </p>
        <p>
          The string is checked by the compiler, and it is easy to store: user remapping, which will
          come later, will replace <code>keys</code> by command id. Two more fields are optional:{' '}
          <code>scope</code> (see below) and <code>allowInTextInput</code>.
        </p>
      </PageSection>
      <PageSection title="Which key matches">
        <p>Shortcuts must work in any keyboard layout, so the key is compared in two ways:</p>
        <ul>
          <li>
            <strong>Letters.</strong> If the pressed key types a Latin letter, the letter is
            compared: <code>Mod+KeyZ</code> fires on the key labelled Z in AZERTY and in Dvorak,
            wherever that key is. If it types another character, such as Cyrillic in the Russian
            layout or a symbol made with Option on macOS, the physical key is compared:{' '}
            <code>Mod+KeyS</code> fires on the key that types Ы.
          </li>
          <li>
            <strong>Digits, punctuation and other keys</strong> are always compared by the physical
            key. Their labels are shown as on the US layout.
          </li>
        </ul>
      </PageSection>
      <PageSection title="Showing a shortcut">
        <p>
          <code>formatShortcut(keys, platform)</code> builds the string for <code>Kbd</code>:
          symbols ⌥ ⇧ ⌘ without separators on macOS, <code>Ctrl+Alt+Shift+…</code> elsewhere.
          Components use <code>useFormatShortcut()</code>, which formats for the current platform.
          The platform is detected once in the entry point with{' '}
          <code>detectPlatform(navigator)</code> and passed down with <code>PlatformProvider</code>.
        </p>
        <p>
          Key names (Ctrl, Shift, Enter, Space and the symbols) are not translated, just like
          language names: users know them in this form in every language.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'ShortcutFormatExample.tsx', code: shortcutFormatSource },
            { fileName: 'ShortcutFormatExample.module.css', code: shortcutFormatStyles },
          ]}
        >
          <ShortcutFormatExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Scopes">
        <p>
          A shortcut without <code>scope</code> is global. A named scope is declared by markup:
          spread <code>hotkeyScopeProps('hierarchy')</code> on the root element of a window or an
          area. Make that element focusable, so that a click on it moves the focus inside.
        </p>
        <p>
          The active scopes are the scopes around the focused element, from the nearest to the
          farthest, and the global scope comes last. The first matching command that is enabled
          runs. A disabled command passes the key on to a wider scope, but the browser action is
          prevented anyway, so a disabled Save never opens the browser&apos;s save dialog.
        </p>
        <p>
          In the example the same Delete key runs a different command in each area. Each example on
          this page creates its own registries and attaches the controller to its own root element,
          so the shortcuts work only inside it.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'HotkeyScopesExample.tsx', code: hotkeyScopesSource },
            { fileName: 'HotkeyScopesExample.module.css', code: hotkeyScopesStyles },
          ]}
        >
          <HotkeyScopesExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="When shortcuts do not fire">
        <ul>
          <li>
            While the focus is in a text field, a text area, a select or editable content, shortcuts
            without Mod or Alt never fire: the keys belong to typing. Shortcuts with Mod or Alt fire
            only when the command sets <code>allowInTextInput</code>, like Run the line in the
            example.
          </li>
          <li>
            While a dialog, a menu or a list is open, global shortcuts do not fire. These elements
            handle their own keys.
          </li>
          <li>
            A key that a component has already handled with <code>preventDefault</code> is left
            alone, and so are characters typed with AltGr and keys pressed during text composition.
          </li>
        </ul>
      </PageSection>
      <PageSection title="Starting the controller">
        <p>
          <code>startHotkeyController({'{ commands, target, platform }'})</code> listens to{' '}
          <code>keydown</code> on the target and returns the function that stops it. The editor
          starts it in the entry point on <code>document</code>. The controller rebuilds the key map
          whenever the set of handled commands changes.
        </p>
      </PageSection>
      <PageSection title="Errors">
        <p>
          The following are errors: in development they throw from the registration, in production
          they are logged and the shortcut is ignored.
        </p>
        <ul>
          <li>Two commands with the same shortcut in the same scope.</li>
          <li>
            A default shortcut that the browser or the operating system keeps for itself. Such a
            shortcut would work on some machines and silently fail on others. The list is{' '}
            <code>RESERVED_SHORTCUTS</code> in <code>@/core/hotkeys/reservedShortcuts</code>:
          </li>
        </ul>
        {PLATFORMS.map((platform) => (
          <div key={platform} className={styles.reserved}>
            <span>{PLATFORM_NAMES[platform]}</span>
            {RESERVED_SHORTCUTS.filter(({ platforms }) => platforms.includes(platform)).map(
              ({ keys }) => (
                <Kbd key={keys} tone="primary">
                  {formatShortcut(keys, platform)}
                </Kbd>
              ),
            )}
          </div>
        ))}
      </PageSection>
    </>
  );
}
