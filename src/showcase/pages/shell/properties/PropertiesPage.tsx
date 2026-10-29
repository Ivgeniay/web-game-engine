import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { CustomEditorExample } from './CustomEditorExample';
import customEditorStyles from './CustomEditorExample.module.css?raw';
import customEditorSource from './CustomEditorExample.tsx?raw';
import { PropertyFieldExample } from './PropertyFieldExample';
import propertyFieldStyles from './PropertyFieldExample.module.css?raw';
import propertyFieldSource from './PropertyFieldExample.tsx?raw';
import { propertiesPageMessages } from './propertiesPageMessages';

export function PropertiesPage() {
  const doc = useDocMessages(propertiesPageMessages);

  return (
    <>
      <PageSection title={doc('describingTitle')}>
        <p>{doc('describingText')}</p>
        <p>{doc('describingText2')}</p>
        <p>{doc('describingText3')}</p>
        <ul>
          <li>{doc('describingItem')}</li>
          <li>{doc('describingItem2')}</li>
          <li>{doc('describingItem3')}</li>
          <li>{doc('describingItem4')}</li>
        </ul>
      </PageSection>
      <PageSection title={doc('fieldTitle')}>
        <p>{doc('fieldText')}</p>
        <p>{doc('fieldText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'PropertyFieldExample.tsx', code: propertyFieldSource },
            { fileName: 'PropertyFieldExample.module.css', code: propertyFieldStyles },
          ]}
        >
          <PropertyFieldExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('listsTitle')}>
        <p>{doc('listsText')}</p>
      </PageSection>
      <PageSection title={doc('customTitle')}>
        <p>{doc('customText')}</p>
        <p>{doc('customText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'CustomEditorExample.tsx', code: customEditorSource },
            { fileName: 'CustomEditorExample.module.css', code: customEditorStyles },
          ]}
        >
          <CustomEditorExample />
        </ExampleBlock>
      </PageSection>
    </>
  );
}
