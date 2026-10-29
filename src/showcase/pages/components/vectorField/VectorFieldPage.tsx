import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { VectorFieldCustomAxesExample } from './VectorFieldCustomAxesExample';
import customAxesStyles from './VectorFieldCustomAxesExample.module.css?raw';
import customAxesSource from './VectorFieldCustomAxesExample.tsx?raw';
import { VectorFieldMixedExample } from './VectorFieldMixedExample';
import mixedStyles from './VectorFieldMixedExample.module.css?raw';
import mixedSource from './VectorFieldMixedExample.tsx?raw';
import { VectorFieldTransformExample } from './VectorFieldTransformExample';
import transformStyles from './VectorFieldTransformExample.module.css?raw';
import transformSource from './VectorFieldTransformExample.tsx?raw';
import { vectorFieldPageMessages } from './vectorFieldPageMessages';

export function VectorFieldPage() {
  const doc = useDocMessages(vectorFieldPageMessages);

  return (
    <>
      <PageSection title={doc('severalNumbersTitle')}>
        <p>{doc('severalNumbersText')}</p>
        <p>{doc('severalNumbersText2')}</p>
        <p>{doc('severalNumbersText3')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'VectorFieldTransformExample.tsx', code: transformSource },
            { fileName: 'VectorFieldTransformExample.module.css', code: transformStyles },
          ]}
        >
          <VectorFieldTransformExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('integersOwnTitle')}>
        <p>{doc('integersOwnText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'VectorFieldCustomAxesExample.tsx', code: customAxesSource },
            { fileName: 'VectorFieldCustomAxesExample.module.css', code: customAxesStyles },
          ]}
        >
          <VectorFieldCustomAxesExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('mixedComponentsTitle')}>
        <p>{doc('mixedComponentsText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'VectorFieldMixedExample.tsx', code: mixedSource },
            { fileName: 'VectorFieldMixedExample.module.css', code: mixedStyles },
          ]}
        >
          <VectorFieldMixedExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('otherPropsTitle')}>
        <p>{doc('otherPropsText')}</p>
      </PageSection>
    </>
  );
}
