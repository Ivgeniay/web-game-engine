import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { KbdExample } from './KbdExample';
import kbdStyles from './KbdExample.module.css?raw';
import kbdSource from './KbdExample.tsx?raw';
import { kbdPageMessages } from './kbdPageMessages';

export function KbdPage() {
  const doc = useDocMessages(kbdPageMessages);

  return (
    <>
      <PageSection title={doc('showingShortcutTitle')}>
        <p>{doc('showingShortcutText')}</p>
        <p>{doc('showingShortcutText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'KbdExample.tsx', code: kbdSource },
            { fileName: 'KbdExample.module.css', code: kbdStyles },
          ]}
        >
          <KbdExample />
        </ExampleBlock>
      </PageSection>
    </>
  );
}
