import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { ColorFieldExample } from './ColorFieldExample';
import colorFieldStyles from './ColorFieldExample.module.css?raw';
import colorFieldSource from './ColorFieldExample.tsx?raw';
import { colorFieldPageMessages } from './colorFieldPageMessages';
import { ColorFieldStatesExample } from './ColorFieldStatesExample';
import colorFieldStatesStyles from './ColorFieldStatesExample.module.css?raw';
import colorFieldStatesSource from './ColorFieldStatesExample.tsx?raw';

export function ColorFieldPage() {
  const doc = useDocMessages(colorFieldPageMessages);

  return (
    <>
      <PageSection title={doc('swatchTitle')}>
        <p>{doc('swatchText')}</p>
        <p>{doc('swatchText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'ColorFieldExample.tsx', code: colorFieldSource },
            { fileName: 'ColorFieldExample.module.css', code: colorFieldStyles },
          ]}
        >
          <ColorFieldExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('mixedTitle')}>
        <p>{doc('mixedText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'ColorFieldStatesExample.tsx', code: colorFieldStatesSource },
            { fileName: 'ColorFieldStatesExample.module.css', code: colorFieldStatesStyles },
          ]}
        >
          <ColorFieldStatesExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('keyboardTitle')}>
        <p>{doc('keyboardText')}</p>
      </PageSection>
    </>
  );
}
