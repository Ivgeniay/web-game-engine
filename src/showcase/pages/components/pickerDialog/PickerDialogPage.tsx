import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { PickerDialogExample } from './PickerDialogExample';
import pickerDialogStyles from './PickerDialogExample.module.css?raw';
import pickerDialogSource from './PickerDialogExample.tsx?raw';
import { pickerDialogPageMessages } from './pickerDialogPageMessages';

export function PickerDialogPage() {
  const doc = useDocMessages(pickerDialogPageMessages);

  return (
    <>
      <PageSection title={doc('pickerTitle')}>
        <p>{doc('pickerText')}</p>
        <p>{doc('pickerText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'PickerDialogExample.tsx', code: pickerDialogSource },
            { fileName: 'PickerDialogExample.module.css', code: pickerDialogStyles },
          ]}
        >
          <PickerDialogExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('keyboardTitle')}>
        <p>{doc('keyboardText')}</p>
      </PageSection>
    </>
  );
}
