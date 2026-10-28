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

export function ButtonPage() {
  return (
    <>
      <PageSection title="Variants">
        <p>
          <code>variant</code> sets the look:
        </p>
        <ul>
          <li>
            <code>default</code> is a regular action;
          </li>
          <li>
            <code>accent</code> is the primary action, at most one per group of buttons;
          </li>
          <li>
            <code>flat</code> has no background or border at rest and is meant for toolbars.
          </li>
        </ul>
        <p>
          The text is the only child and must be a ready string: primitives know nothing about
          localization, so pass a translated text from <code>useMessages</code>.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'ButtonVariantsExample.tsx', code: buttonVariantsSource },
            { fileName: 'ButtonVariantsExample.module.css', code: buttonVariantsStyles },
          ]}
        >
          <ButtonVariantsExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Sizes">
        <p>
          <code>size</code> is <code>sm</code>, <code>md</code> (the default) or <code>lg</code>.
          The height comes from the <code>--size-control-height-*</code> tokens.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'ButtonSizesExample.tsx', code: buttonSizesSource },
            { fileName: 'ButtonSizesExample.module.css', code: buttonSizesStyles },
          ]}
        >
          <ButtonSizesExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Icon">
        <p>
          <code>icon</code> takes an icon of a set or an <code>iconRef</code>, the same as{' '}
          <code>Icon</code>, and shows it before the text. Its size follows the button: 12 pixels
          for <code>sm</code>, 16 pixels for <code>md</code> and <code>lg</code>. For a button
          without text use <code>IconButton</code>.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'ButtonWithIconExample.tsx', code: buttonWithIconSource },
            { fileName: 'ButtonWithIconExample.module.css', code: buttonWithIconStyles },
          ]}
        >
          <ButtonWithIconExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Disabled">
        <p>
          <code>disabled</code> is the native attribute. A disabled button ignores the mouse and the
          keyboard, leaves the Tab order and shows its text in <code>--color-text-disabled</code>. A
          disabled accent button looks like a disabled default one.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'ButtonDisabledExample.tsx', code: buttonDisabledSource },
            { fileName: 'ButtonDisabledExample.module.css', code: buttonDisabledStyles },
          ]}
        >
          <ButtonDisabledExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Keyboard and focus">
        <p>
          The button is a native <code>button</code> with <code>type="button"</code>: Tab reaches
          it, Enter and Space press it. The focus outline shows only for keyboard focus. On an
          accent button the outline is drawn outside with a one pixel gap, so it lies on the surface
          around the button and stays visible against the accent color.
        </p>
      </PageSection>
      <PageSection title="Other props">
        <ul>
          <li>
            <code>ref</code> receives the <code>button</code> element, for example to anchor a
            popup.
          </li>
          <li>
            Native button attributes and event handlers pass through, except <code>style</code>,{' '}
            <code>type</code> and <code>children</code>.
          </li>
          <li>
            <code>className</code> is for placing the button in a layout: margins, flex and grid
            properties. Do not recolor a button through it; the look changes only with{' '}
            <code>variant</code> and <code>size</code>.
          </li>
        </ul>
      </PageSection>
    </>
  );
}
