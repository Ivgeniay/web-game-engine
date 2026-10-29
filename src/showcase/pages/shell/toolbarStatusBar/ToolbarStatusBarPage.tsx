import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { ToolbarStatusBarExample } from './ToolbarStatusBarExample';
import exampleStyles from './ToolbarStatusBarExample.module.css?raw';
import exampleSource from './ToolbarStatusBarExample.tsx?raw';
import { toolbarStatusBarPageMessages } from './toolbarStatusBarPageMessages';

export function ToolbarStatusBarPage() {
  const doc = useDocMessages(toolbarStatusBarPageMessages);

  return (
    <>
      <PageSection title={doc('mainToolbarTitle')}>
        <p>{doc('mainToolbarText')}</p>
        <ul>
          <li>{doc('mainToolbarItem')}</li>
          <li>{doc('mainToolbarItem2')}</li>
        </ul>
        <p>{doc('mainToolbarText2')}</p>
      </PageSection>
      <PageSection title={doc('statusBarTitle')}>
        <p>{doc('statusBarText')}</p>
      </PageSection>
      <PageSection title={doc('exampleTitle')}>
        <p>{doc('exampleText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'ToolbarStatusBarExample.tsx', code: exampleSource },
            { fileName: 'ToolbarStatusBarExample.module.css', code: exampleStyles },
          ]}
        >
          <ToolbarStatusBarExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('editorFrameTitle')}>
        <p>{doc('editorFrameText')}</p>
      </PageSection>
    </>
  );
}
