import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { LayoutExample } from './LayoutExample';
import layoutStyles from './LayoutExample.module.css?raw';
import layoutSource from './LayoutExample.tsx?raw';

export function LayoutPage() {
  return (
    <>
      <PageSection title="Default layout">
        <p>
          The integration describes its default layout as data and hands it to{' '}
          <code>workspace.setDefaultLayout(layout)</code> at startup, next to the registration of
          its windows. The call returns its cancellation. Without a default layout the workspace
          starts empty.
        </p>
        <ul>
          <li>
            <code>{'tabsLayout([sceneWindow, gameWindow], { activeWindow?, weight? })'}</code> is a
            group of tabs. The first window is active unless <code>activeWindow</code> says
            otherwise.
          </li>
          <li>
            <code>{"splitLayout('row' | 'column', children, { weight? })"}</code> places its
            children side by side or one under another. A nested split of the same direction is
            merged into its parent.
          </li>
          <li>
            <code>weight</code> is the share of a child among its siblings, 1 by default. Weights 1,
            3 and 1 give the middle group three fifths of the row.
          </li>
        </ul>
      </PageSection>
      <PageSection title="Saving and restoring">
        <p>
          <code>DockLayout</code> takes a <code>layoutStorage</code>, created with{' '}
          <code>createLayoutStorage(browserStorage, key)</code>. The key is chosen by the entry
          point, and every application on the same address has its own key: the editor uses{' '}
          <code>editor-layout</code>, the demo scene <code>demo-layout</code>, the example below a
          key of its own. Otherwise one application would restore, and then overwrite, the layout of
          another one with windows it does not know. The theme and the language, on the contrary,
          are shared by all applications on the same address on purpose. Without a storage the
          layout lives only until the page is reloaded.
        </p>
        <ul>
          <li>
            The layout is saved half a second after the last change and at once when the page is
            hidden or <code>DockLayout</code> unmounts.
          </li>
          <li>
            The stored value is <code>{'{ version: 1, current }'}</code>, where <code>current</code>{' '}
            is the serialized dockview layout. Named layouts will sit next to it in the same value.
          </li>
          <li>
            Windows whose type is no longer registered are skipped on restore, the rest of the
            layout stays. If nothing is left, or the stored value is broken or of another version,
            the default layout is applied and the editor keeps working.
          </li>
          <li>
            Window types and the default layout must be registered before <code>DockLayout</code>{' '}
            mounts: the layout is restored once, when the dock is ready.
          </li>
        </ul>
      </PageSection>
      <PageSection title="Reset">
        <p>
          The framework command <code>resetLayoutCommand</code> asks for confirmation and brings the
          default layout back. The framework does not put it anywhere: the integration adds it to
          its menu, usually under Window. The command is disabled while there is no default layout.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'LayoutExample.tsx', code: layoutSource },
            { fileName: 'LayoutExample.module.css', code: layoutStyles },
          ]}
        >
          <LayoutExample />
        </ExampleBlock>
      </PageSection>
    </>
  );
}
