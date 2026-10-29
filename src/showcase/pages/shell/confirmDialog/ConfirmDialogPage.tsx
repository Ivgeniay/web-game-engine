import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { ConfirmDialogExample } from './ConfirmDialogExample';
import confirmStyles from './ConfirmDialogExample.module.css?raw';
import confirmSource from './ConfirmDialogExample.tsx?raw';
import { ConfirmQueueExample } from './ConfirmQueueExample';
import queueStyles from './ConfirmQueueExample.module.css?raw';
import queueSource from './ConfirmQueueExample.tsx?raw';
import { confirmDialogPageMessages } from './confirmDialogPageMessages';

export function ConfirmDialogPage() {
  const doc = useDocMessages(confirmDialogPageMessages);

  return (
    <>
      <PageSection title={doc('askingCodeTitle')}>
        <p>{doc('askingCodeText')}</p>
        <ul>
          <li>{doc('askingCodeItem')}</li>
          <li>{doc('askingCodeItem2')}</li>
          <li>{doc('askingCodeItem3')}</li>
          <li>{doc('askingCodeItem4')}</li>
        </ul>
        <ExampleBlock
          sources={[
            { fileName: 'ConfirmDialogExample.tsx', code: confirmSource },
            { fileName: 'ConfirmDialogExample.module.css', code: confirmStyles },
          ]}
        >
          <ConfirmDialogExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('queueTitle')}>
        <p>{doc('queueText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'ConfirmQueueExample.tsx', code: queueSource },
            { fileName: 'ConfirmQueueExample.module.css', code: queueStyles },
          ]}
        >
          <ConfirmQueueExample />
        </ExampleBlock>
      </PageSection>
    </>
  );
}
