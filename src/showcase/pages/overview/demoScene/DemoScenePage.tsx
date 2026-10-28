import defaultLayoutSource from '@/demo/defaultLayout.ts?raw';
import demoExtensionSource from '@/demo/demoExtension.ts?raw';
import demoMainSource from '@/demo/main.tsx?raw';
import demoWindowsSource from '@/demo/windows/demoWindows.ts?raw';
import sceneWindowSource from '@/demo/windows/SceneWindow.tsx?raw';
import { CodeBlock } from '@/showcase/template/CodeBlock';
import { PageSection } from '@/showcase/template/PageSection';
import styles from './DemoScenePage.module.css';

const DEMO_URL = '/demo.html';

export function DemoScenePage() {
  return (
    <>
      <PageSection title="What it is">
        <p>
          The demo scene is a demonstration integration: it puts every extension point of the
          framework together and looks like a Unity-style editor. It is a sample for engine
          developers and a check that the mechanisms work together, not only one by one. Like the
          showcase, it exists only in <code>pnpm dev</code> and is not part of the build.
        </p>
        <p className={styles.link}>
          <a href={DEMO_URL}>Open the demo scene</a>
        </p>
        <ul>
          <li>Windows Scene, Game, Hierarchy, Inspector and Project with placeholder content.</li>
          <li>Menus File, Edit, GameObject and Window.</li>
          <li>
            Tools Move, Rotate and Scale on the left of the toolbar, Play, Pause and Step in the
            middle.
          </li>
          <li>The play mode in the status bar.</li>
          <li>The classic Unity layout by default.</li>
        </ul>
      </PageSection>
      <PageSection title="Where it lives">
        <p>
          The demo lives in <code>src/demo/</code>, next to <code>src/engine/</code>, where the
          integration of a real engine goes. It is written the way an engine developer would write
          an integration: it imports the framework through <code>@/</code> and extends it through
          registries only. The framework never imports <code>src/demo/</code> or{' '}
          <code>src/engine/</code>; the linter checks it. The showcase may read the demo only as
          source text with <code>?raw</code>, as on this page.
        </p>
        <ul>
          <li>
            <code>demo.html</code> and <code>src/demo/main.tsx</code> are the entry point. It
            repeats <code>src/app/main.tsx</code>, adds the stores of the demo and installs the demo
            integration. The layout is stored under its own key <code>demo-layout</code>.
          </li>
          <li>
            <code>demoExtension.ts</code> is the integration itself: one{' '}
            <code>EditorExtension</code> made of smaller registrations.
          </li>
          <li>
            <code>windows/</code> holds the windows, <code>playMode/</code> and <code>scene/</code>{' '}
            the mock state with its commands, <code>icons/</code> the icon set of the demo.
          </li>
        </ul>
      </PageSection>
      <PageSection title="Entry point">
        <CodeBlock fileName="src/demo/main.tsx" code={demoMainSource} />
      </PageSection>
      <PageSection title="The integration">
        <CodeBlock fileName="src/demo/demoExtension.ts" code={demoExtensionSource} />
      </PageSection>
      <PageSection title="Windows">
        <p>
          The window types are data. Their registration also places the items that belong to the
          windows: Show grid in the tab menu of Scene and the context menu of the hierarchy. The
          items appear only while a window that handles their commands is open.
        </p>
        <CodeBlock fileName="src/demo/windows/demoWindows.ts" code={demoWindowsSource} />
        <p>
          A window is an ordinary component. Scene brings the handlers of its commands for its
          lifetime with <code>useRegistration</code>: Frame selected works with F only while the
          focus is inside the Scene window, Show grid toggles from the tab menu.
        </p>
        <CodeBlock fileName="src/demo/windows/SceneWindow.tsx" code={sceneWindowSource} />
      </PageSection>
      <PageSection title="Default layout">
        <CodeBlock fileName="src/demo/defaultLayout.ts" code={defaultLayoutSource} />
      </PageSection>
    </>
  );
}
