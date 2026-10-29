import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { IconButtonSizesExample } from './IconButtonSizesExample';
import iconButtonSizesStyles from './IconButtonSizesExample.module.css?raw';
import iconButtonSizesSource from './IconButtonSizesExample.tsx?raw';
import { IconButtonVariantsExample } from './IconButtonVariantsExample';
import iconButtonVariantsStyles from './IconButtonVariantsExample.module.css?raw';
import iconButtonVariantsSource from './IconButtonVariantsExample.tsx?raw';
import { iconButtonPageMessages } from './iconButtonPageMessages';

export function IconButtonPage() {
  const doc = useDocMessages(iconButtonPageMessages);

  return (
    <>
      <PageSection title={doc('labelIconTitle')}>
        <p>{doc('labelIconText')}</p>
        <p>{doc('labelIconText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'IconButtonVariantsExample.tsx', code: iconButtonVariantsSource },
            { fileName: 'IconButtonVariantsExample.module.css', code: iconButtonVariantsStyles },
          ]}
        >
          <IconButtonVariantsExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('sizesTitle')}>
        <p>{doc('sizesText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'IconButtonSizesExample.tsx', code: iconButtonSizesSource },
            { fileName: 'IconButtonSizesExample.module.css', code: iconButtonSizesStyles },
          ]}
        >
          <IconButtonSizesExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('keyboardFocusTitle')}>
        <p>{doc('keyboardFocusText')}</p>
      </PageSection>
    </>
  );
}
