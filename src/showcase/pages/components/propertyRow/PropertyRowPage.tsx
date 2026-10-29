import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { PropertyRowExample } from './PropertyRowExample';
import propertyRowStyles from './PropertyRowExample.module.css?raw';
import propertyRowSource from './PropertyRowExample.tsx?raw';
import { PropertyRowSlotsExample } from './PropertyRowSlotsExample';
import propertyRowSlotsStyles from './PropertyRowSlotsExample.module.css?raw';
import propertyRowSlotsSource from './PropertyRowSlotsExample.tsx?raw';
import { propertyRowPageMessages } from './propertyRowPageMessages';

export function PropertyRowPage() {
  const doc = useDocMessages(propertyRowPageMessages);

  return (
    <>
      <PageSection title={doc('captionFieldTitle')}>
        <p>{doc('captionFieldText')}</p>
        <p>{doc('captionFieldText2')}</p>
        <p>{doc('captionFieldText3')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'PropertyRowExample.tsx', code: propertyRowSource },
            { fileName: 'PropertyRowExample.module.css', code: propertyRowStyles },
          ]}
        >
          <PropertyRowExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('depthSlotsTitle')}>
        <p>{doc('depthSlotsText')}</p>
        <p>{doc('depthSlotsText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'PropertyRowSlotsExample.tsx', code: propertyRowSlotsSource },
            { fileName: 'PropertyRowSlotsExample.module.css', code: propertyRowSlotsStyles },
          ]}
        >
          <PropertyRowSlotsExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('otherPropsTitle')}>
        <p>{doc('otherPropsText')}</p>
      </PageSection>
    </>
  );
}
