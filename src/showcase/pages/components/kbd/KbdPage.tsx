import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { KbdExample } from './KbdExample';
import kbdStyles from './KbdExample.module.css?raw';
import kbdSource from './KbdExample.tsx?raw';

export function KbdPage() {
  return (
    <>
      <PageSection title="Showing a shortcut">
        <p>
          <code>Kbd</code> shows a keyboard shortcut in a <code>kbd</code> element, in the secondary
          text color, the way menus show shortcuts. It only displays a ready string and never
          receives the focus.
        </p>
        <p>
          The string itself depends on the platform: macOS uses the ⌘ ⇧ ⌥ ⌃ symbols, other platforms
          write <code>Ctrl+Shift+S</code>. The shortcut mechanism of the editor will build that
          string from a command; until then the example passes ready strings for both platforms.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'KbdExample.tsx', code: kbdSource },
            { fileName: 'KbdExample.module.css', code: kbdStyles },
          ]}
        >
          <KbdExample />
        </ExampleBlock>
      </PageSection>
    </>
  );
}
