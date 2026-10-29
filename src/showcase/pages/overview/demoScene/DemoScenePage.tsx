import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import defaultLayoutSource from '@/demo/defaultLayout.ts?raw';
import demoExtensionSource from '@/demo/demoExtension.ts?raw';
import demoMainSource from '@/demo/main.tsx?raw';
import demoWindowsSource from '@/demo/windows/demoWindows.ts?raw';
import hierarchyWindowSource from '@/demo/windows/HierarchyWindow.tsx?raw';
import sceneWindowSource from '@/demo/windows/SceneWindow.tsx?raw';
import { CodeBlock } from '@/showcase/template/CodeBlock';
import { PageSection } from '@/showcase/template/PageSection';
import styles from './DemoScenePage.module.css';

const DEMO_URL = '/demo.html';
import { demoScenePageMessages } from './demoScenePageMessages';

export function DemoScenePage() {
  const doc = useDocMessages(demoScenePageMessages);

  return (
    <>
      <PageSection title={doc('whatIsTitle')}>
        <p>{doc('whatIsText')}</p>
        <p className={styles.link}>
          <a href={DEMO_URL}>{doc('whatIsLink')}</a>
        </p>
        <ul>
          <li>{doc('whatIsItem')}</li>
          <li>{doc('whatIsItem2')}</li>
          <li>{doc('whatIsItem3')}</li>
          <li>{doc('whatIsItem4')}</li>
          <li>{doc('whatIsItem5')}</li>
          <li>{doc('whatIsItem6')}</li>
          <li>{doc('whatIsItem7')}</li>
          <li>{doc('whatIsItem8')}</li>
          <li>{doc('whatIsItem9')}</li>
        </ul>
      </PageSection>
      <PageSection title={doc('whereLivesTitle')}>
        <p>{doc('whereLivesText')}</p>
        <ul>
          <li>{doc('whereLivesItem')}</li>
          <li>{doc('whereLivesItem2')}</li>
          <li>{doc('whereLivesItem3')}</li>
        </ul>
      </PageSection>
      <PageSection title={doc('entryPointTitle')}>
        <CodeBlock fileName="src/demo/main.tsx" code={demoMainSource} />
      </PageSection>
      <PageSection title={doc('integrationTitle')}>
        <CodeBlock fileName="src/demo/demoExtension.ts" code={demoExtensionSource} />
      </PageSection>
      <PageSection title={doc('windowsTitle')}>
        <p>{doc('windowsText')}</p>
        <CodeBlock fileName="src/demo/windows/demoWindows.ts" code={demoWindowsSource} />
        <p>{doc('windowsText2')}</p>
        <CodeBlock fileName="src/demo/windows/SceneWindow.tsx" code={sceneWindowSource} />
        <p>{doc('windowsText3')}</p>
        <CodeBlock fileName="src/demo/windows/HierarchyWindow.tsx" code={hierarchyWindowSource} />
      </PageSection>
      <PageSection title={doc('defaultLayoutTitle')}>
        <CodeBlock fileName="src/demo/defaultLayout.ts" code={defaultLayoutSource} />
      </PageSection>
    </>
  );
}
