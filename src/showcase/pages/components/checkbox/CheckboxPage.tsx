import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { CheckboxDisabledExample } from './CheckboxDisabledExample';
import checkboxDisabledStyles from './CheckboxDisabledExample.module.css?raw';
import checkboxDisabledSource from './CheckboxDisabledExample.tsx?raw';
import { CheckboxExample } from './CheckboxExample';
import checkboxStyles from './CheckboxExample.module.css?raw';
import checkboxSource from './CheckboxExample.tsx?raw';
import { CheckboxMixedExample } from './CheckboxMixedExample';
import checkboxMixedStyles from './CheckboxMixedExample.module.css?raw';
import checkboxMixedSource from './CheckboxMixedExample.tsx?raw';
import { checkboxPageMessages } from './checkboxPageMessages';

export function CheckboxPage() {
  const doc = useDocMessages(checkboxPageMessages);

  return (
    <>
      <PageSection title={doc('checkedStateTitle')}>
        <p>{doc('checkedStateText')}</p>
        <p>{doc('checkedStateText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'CheckboxExample.tsx', code: checkboxSource },
            { fileName: 'CheckboxExample.module.css', code: checkboxStyles },
          ]}
        >
          <CheckboxExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('mixedStateTitle')}>
        <p>{doc('mixedStateText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'CheckboxMixedExample.tsx', code: checkboxMixedSource },
            { fileName: 'CheckboxMixedExample.module.css', code: checkboxMixedStyles },
          ]}
        >
          <CheckboxMixedExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('disabledTitle')}>
        <p>{doc('disabledText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'CheckboxDisabledExample.tsx', code: checkboxDisabledSource },
            { fileName: 'CheckboxDisabledExample.module.css', code: checkboxDisabledStyles },
          ]}
        >
          <CheckboxDisabledExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('keyboardOtherTitle')}>
        <p>{doc('keyboardOtherText')}</p>
      </PageSection>
    </>
  );
}
