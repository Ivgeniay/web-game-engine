import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { ButtonDisabledExample } from './ButtonDisabledExample';
import buttonDisabledStyles from './ButtonDisabledExample.module.css?raw';
import buttonDisabledSource from './ButtonDisabledExample.tsx?raw';
import { ButtonSizesExample } from './ButtonSizesExample';
import buttonSizesStyles from './ButtonSizesExample.module.css?raw';
import buttonSizesSource from './ButtonSizesExample.tsx?raw';
import { ButtonVariantsExample } from './ButtonVariantsExample';
import buttonVariantsStyles from './ButtonVariantsExample.module.css?raw';
import buttonVariantsSource from './ButtonVariantsExample.tsx?raw';
import { ButtonWithIconExample } from './ButtonWithIconExample';
import buttonWithIconStyles from './ButtonWithIconExample.module.css?raw';
import buttonWithIconSource from './ButtonWithIconExample.tsx?raw';
import { buttonPageMessages } from './buttonPageMessages';

export function ButtonPage() {
  const doc = useDocMessages(buttonPageMessages);

  return (
    <>
      <PageSection title={doc('variantsTitle')}>
        <p>{doc('variantsText')}</p>
        <ul>
          <li>{doc('variantsItem')}</li>
          <li>{doc('variantsItem2')}</li>
          <li>{doc('variantsItem3')}</li>
        </ul>
        <p>{doc('variantsText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'ButtonVariantsExample.tsx', code: buttonVariantsSource },
            { fileName: 'ButtonVariantsExample.module.css', code: buttonVariantsStyles },
          ]}
        >
          <ButtonVariantsExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('sizesTitle')}>
        <p>{doc('sizesText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'ButtonSizesExample.tsx', code: buttonSizesSource },
            { fileName: 'ButtonSizesExample.module.css', code: buttonSizesStyles },
          ]}
        >
          <ButtonSizesExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('iconTitle')}>
        <p>{doc('iconText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'ButtonWithIconExample.tsx', code: buttonWithIconSource },
            { fileName: 'ButtonWithIconExample.module.css', code: buttonWithIconStyles },
          ]}
        >
          <ButtonWithIconExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('disabledTitle')}>
        <p>{doc('disabledText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'ButtonDisabledExample.tsx', code: buttonDisabledSource },
            { fileName: 'ButtonDisabledExample.module.css', code: buttonDisabledStyles },
          ]}
        >
          <ButtonDisabledExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('keyboardFocusTitle')}>
        <p>{doc('keyboardFocusText')}</p>
      </PageSection>
      <PageSection title={doc('otherPropsTitle')}>
        <ul>
          <li>{doc('otherPropsItem')}</li>
          <li>{doc('otherPropsItem2')}</li>
          <li>{doc('otherPropsItem3')}</li>
        </ul>
      </PageSection>
    </>
  );
}
