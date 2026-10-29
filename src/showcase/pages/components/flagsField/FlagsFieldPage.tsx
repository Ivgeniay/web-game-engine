import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { FlagsFieldExample } from './FlagsFieldExample';
import flagsFieldStyles from './FlagsFieldExample.module.css?raw';
import flagsFieldSource from './FlagsFieldExample.tsx?raw';
import { FlagsFieldMixedExample } from './FlagsFieldMixedExample';
import flagsFieldMixedStyles from './FlagsFieldMixedExample.module.css?raw';
import flagsFieldMixedSource from './FlagsFieldMixedExample.tsx?raw';
import { flagsFieldPageMessages } from './flagsFieldPageMessages';

export function FlagsFieldPage() {
  const doc = useDocMessages(flagsFieldPageMessages);

  return (
    <>
      <PageSection title={doc('choosingTitle')}>
        <p>{doc('choosingText')}</p>
        <p>{doc('choosingText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'FlagsFieldExample.tsx', code: flagsFieldSource },
            { fileName: 'FlagsFieldExample.module.css', code: flagsFieldStyles },
          ]}
        >
          <FlagsFieldExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('mixedTitle')}>
        <p>{doc('mixedText')}</p>
        <p>{doc('mixedText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'FlagsFieldMixedExample.tsx', code: flagsFieldMixedSource },
            { fileName: 'FlagsFieldMixedExample.module.css', code: flagsFieldMixedStyles },
          ]}
        >
          <FlagsFieldMixedExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('keyboardTitle')}>
        <p>{doc('keyboardText')}</p>
      </PageSection>
    </>
  );
}
