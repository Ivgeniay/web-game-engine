import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { ComponentHeaderExample } from './ComponentHeaderExample';
import componentHeaderStyles from './ComponentHeaderExample.module.css?raw';
import componentHeaderSource from './ComponentHeaderExample.tsx?raw';
import { componentHeaderPageMessages } from './componentHeaderPageMessages';

export function ComponentHeaderPage() {
  const doc = useDocMessages(componentHeaderPageMessages);

  return (
    <>
      <PageSection title={doc('titleInspectorTitle')}>
        <p>{doc('titleInspectorText')}</p>
        <p>{doc('titleInspectorText2')}</p>
        <ul>
          <li>{doc('titleInspectorItem')}</li>
          <li>{doc('titleInspectorItem2')}</li>
          <li>{doc('titleInspectorItem3')}</li>
          <li>{doc('titleInspectorItem4')}</li>
        </ul>
        <p>{doc('titleInspectorText3')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'ComponentHeaderExample.tsx', code: componentHeaderSource },
            { fileName: 'ComponentHeaderExample.module.css', code: componentHeaderStyles },
          ]}
        >
          <ComponentHeaderExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('keyboardTitle')}>
        <p>{doc('keyboardText')}</p>
      </PageSection>
    </>
  );
}
