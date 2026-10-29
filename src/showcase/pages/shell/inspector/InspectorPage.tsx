import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { CustomSectionExample } from './CustomSectionExample';
import customSectionStyles from './CustomSectionExample.module.css?raw';
import customSectionSource from './CustomSectionExample.tsx?raw';
import { InspectorExample } from './InspectorExample';
import inspectorStyles from './InspectorExample.module.css?raw';
import inspectorSource from './InspectorExample.tsx?raw';
import { inspectorPageMessages } from './inspectorPageMessages';

export function InspectorPage() {
  const doc = useDocMessages(inspectorPageMessages);

  return (
    <>
      <PageSection title={doc('sourceTitle')}>
        <p>{doc('sourceText')}</p>
        <p>{doc('sourceText2')}</p>
        <ul>
          <li>{doc('sourceItem')}</li>
          <li>{doc('sourceItem2')}</li>
          <li>{doc('sourceItem3')}</li>
        </ul>
      </PageSection>
      <PageSection title={doc('defaultsTitle')}>
        <p>{doc('defaultsText')}</p>
        <p>{doc('defaultsText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'InspectorExample.tsx', code: inspectorSource },
            { fileName: 'InspectorExample.module.css', code: inspectorStyles },
          ]}
        >
          <InspectorExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('customTitle')}>
        <p>{doc('customText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'CustomSectionExample.tsx', code: customSectionSource },
            { fileName: 'CustomSectionExample.module.css', code: customSectionStyles },
          ]}
        >
          <CustomSectionExample />
        </ExampleBlock>
      </PageSection>
    </>
  );
}
