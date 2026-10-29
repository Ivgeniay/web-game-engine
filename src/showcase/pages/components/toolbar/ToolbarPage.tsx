import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { SceneToolbarExample } from './SceneToolbarExample';
import sceneToolbarStyles from './SceneToolbarExample.module.css?raw';
import sceneToolbarSource from './SceneToolbarExample.tsx?raw';
import { ToolbarDisabledExample } from './ToolbarDisabledExample';
import toolbarDisabledStyles from './ToolbarDisabledExample.module.css?raw';
import toolbarDisabledSource from './ToolbarDisabledExample.tsx?raw';
import { toolbarPageMessages } from './toolbarPageMessages';

export function ToolbarPage() {
  const doc = useDocMessages(toolbarPageMessages);

  return (
    <>
      <PageSection title={doc('toolbarPrimitivesTitle')}>
        <p>{doc('toolbarPrimitivesText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'SceneToolbarExample.tsx', code: sceneToolbarSource },
            { fileName: 'SceneToolbarExample.module.css', code: sceneToolbarStyles },
          ]}
        >
          <SceneToolbarExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('keyboardTitle')}>
        <p>{doc('keyboardText')}</p>
        <p>{doc('keyboardText2')}</p>
      </PageSection>
      <PageSection title={doc('disabledButTitle')}>
        <p>{doc('disabledButText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'ToolbarDisabledExample.tsx', code: toolbarDisabledSource },
            { fileName: 'ToolbarDisabledExample.module.css', code: toolbarDisabledStyles },
          ]}
        >
          <ToolbarDisabledExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('layoutTitle')}>
        <p>{doc('layoutText')}</p>
      </PageSection>
    </>
  );
}
