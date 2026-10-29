import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { SliderExample } from './SliderExample';
import sliderStyles from './SliderExample.module.css?raw';
import sliderSource from './SliderExample.tsx?raw';
import { SliderLogExample } from './SliderLogExample';
import sliderLogStyles from './SliderLogExample.module.css?raw';
import sliderLogSource from './SliderLogExample.tsx?raw';
import { sliderPageMessages } from './sliderPageMessages';

export function SliderPage() {
  const doc = useDocMessages(sliderPageMessages);

  return (
    <>
      <PageSection title={doc('draggingTitle')}>
        <p>{doc('draggingText')}</p>
        <p>{doc('draggingText2')}</p>
        <p>{doc('draggingText3')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'SliderExample.tsx', code: sliderSource },
            { fileName: 'SliderExample.module.css', code: sliderStyles },
          ]}
        >
          <SliderExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('logMixedTitle')}>
        <p>{doc('logMixedText')}</p>
        <p>{doc('logMixedText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'SliderLogExample.tsx', code: sliderLogSource },
            { fileName: 'SliderLogExample.module.css', code: sliderLogStyles },
          ]}
        >
          <SliderLogExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('keyboardTitle')}>
        <p>{doc('keyboardText')}</p>
        <p>{doc('keyboardText2')}</p>
        <p>{doc('keyboardText3')}</p>
      </PageSection>
    </>
  );
}
