import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { ColorPickerExample } from './ColorPickerExample';
import colorPickerStyles from './ColorPickerExample.module.css?raw';
import colorPickerSource from './ColorPickerExample.tsx?raw';
import { colorPickerPageMessages } from './colorPickerPageMessages';

export function ColorPickerPage() {
  const doc = useDocMessages(colorPickerPageMessages);

  return (
    <>
      <PageSection title={doc('partsTitle')}>
        <p>{doc('partsText')}</p>
        <p>{doc('partsText2')}</p>
        <p>{doc('partsText3')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'ColorPickerExample.tsx', code: colorPickerSource },
            { fileName: 'ColorPickerExample.module.css', code: colorPickerStyles },
          ]}
        >
          <ColorPickerExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('protocolTitle')}>
        <p>{doc('protocolText')}</p>
        <p>{doc('protocolText2')}</p>
      </PageSection>
      <PageSection title={doc('keyboardTitle')}>
        <p>{doc('keyboardText')}</p>
      </PageSection>
    </>
  );
}
