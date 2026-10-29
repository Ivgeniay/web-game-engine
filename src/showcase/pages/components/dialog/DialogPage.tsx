import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { DialogConfirmExample } from './DialogConfirmExample';
import dialogConfirmStyles from './DialogConfirmExample.module.css?raw';
import dialogConfirmSource from './DialogConfirmExample.tsx?raw';
import { DialogFormExample } from './DialogFormExample';
import dialogFormStyles from './DialogFormExample.module.css?raw';
import dialogFormSource from './DialogFormExample.tsx?raw';
import { dialogPageMessages } from './dialogPageMessages';

export function DialogPage() {
  const doc = useDocMessages(dialogPageMessages);

  return (
    <>
      <PageSection title={doc('modalWindowTitle')}>
        <p>{doc('modalWindowText')}</p>
        <p>{doc('modalWindowText2')}</p>
        <p>{doc('modalWindowText3')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'DialogFormExample.tsx', code: dialogFormSource },
            { fileName: 'DialogFormExample.module.css', code: dialogFormStyles },
          ]}
        >
          <DialogFormExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('mainActionTitle')}>
        <p>{doc('mainActionText')}</p>
        <p>{doc('mainActionText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'DialogConfirmExample.tsx', code: dialogConfirmSource },
            { fileName: 'DialogConfirmExample.module.css', code: dialogConfirmStyles },
          ]}
        >
          <DialogConfirmExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('focusTitle')}>
        <p>{doc('focusText')}</p>
      </PageSection>
    </>
  );
}
