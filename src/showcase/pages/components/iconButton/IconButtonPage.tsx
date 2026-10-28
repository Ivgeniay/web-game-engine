import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { IconButtonSizesExample } from './IconButtonSizesExample';
import iconButtonSizesStyles from './IconButtonSizesExample.module.css?raw';
import iconButtonSizesSource from './IconButtonSizesExample.tsx?raw';
import { IconButtonVariantsExample } from './IconButtonVariantsExample';
import iconButtonVariantsStyles from './IconButtonVariantsExample.module.css?raw';
import iconButtonVariantsSource from './IconButtonVariantsExample.tsx?raw';

export function IconButtonPage() {
  return (
    <>
      <PageSection title="Label and icon">
        <p>
          <code>IconButton</code> shows only an icon. <code>label</code> is required: it names the
          button for screen readers through <code>aria-label</code> and is shown in a{' '}
          <code>Tooltip</code> on hover and on keyboard focus. <code>shortcut</code> adds a key
          combination to the tooltip; only then the tooltip also describes the button through{' '}
          <code>aria-describedby</code>, so a screen reader does not read the label twice.
        </p>
        <p>
          <code>icon</code> takes an icon of a set or an <code>iconRef</code>. <code>variant</code>{' '}
          is the same as for <code>Button</code>, with <code>flat</code> as the default, since icon
          buttons usually sit in toolbars and headers. Disabled icon buttons behave like disabled
          buttons, including <code>focusableWhenDisabled</code>, which keeps the tooltip of a
          disabled button in a toolbar.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'IconButtonVariantsExample.tsx', code: iconButtonVariantsSource },
            { fileName: 'IconButtonVariantsExample.module.css', code: iconButtonVariantsStyles },
          ]}
        >
          <IconButtonVariantsExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Sizes">
        <p>
          The button is square, its side equals the control height of its <code>size</code>. The
          icon is 12 pixels for <code>sm</code> and 16 pixels for <code>md</code> and{' '}
          <code>lg</code>.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'IconButtonSizesExample.tsx', code: iconButtonSizesSource },
            { fileName: 'IconButtonSizesExample.module.css', code: iconButtonSizesStyles },
          ]}
        >
          <IconButtonSizesExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Keyboard, focus and other props">
        <p>
          Keyboard and focus work as for <code>Button</code>: Tab reaches it, Enter and Space press
          it. <code>ref</code>, native attributes and <code>className</code> work the same way too,
          except that <code>aria-label</code> comes from <code>label</code> and <code>title</code>{' '}
          is not accepted: the tooltip replaces it.
        </p>
      </PageSection>
    </>
  );
}
