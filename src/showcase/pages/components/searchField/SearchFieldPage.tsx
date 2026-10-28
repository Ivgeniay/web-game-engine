import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { SearchFieldExample } from './SearchFieldExample';
import searchFieldStyles from './SearchFieldExample.module.css?raw';
import searchFieldSource from './SearchFieldExample.tsx?raw';

export function SearchFieldPage() {
  return (
    <>
      <PageSection title="Filtering">
        <p>
          A search field filters the contents of a window. It is a native{' '}
          <code>input type=&quot;search&quot;</code> with a magnifier and a clear button. The value
          is controlled, and <code>onValueChange</code> receives the query on every input: a search
          query is not scene data, so the field does not use the preview and commit protocol.
          Delaying an expensive filter is up to the owner.
        </p>
        <p>
          <code>label</code> names the field for screen readers, <code>clearLabel</code> names the
          clear button and shows in its tooltip. The clear button appears only when the field is not
          empty, is not a Tab stop and keeps focus in the field.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'SearchFieldExample.tsx', code: searchFieldSource },
            { fileName: 'SearchFieldExample.module.css', code: searchFieldStyles },
          ]}
        >
          <SearchFieldExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Keyboard and other props">
        <p>
          Esc clears the query, and a second Esc leaves the field. A window focuses its search field
          with its own hotkey, such as Mod+F in the window&apos;s scope, not with logic inside the
          field. Moving to the results with the Down arrow belongs to the list below the field:
          handle <code>onKeyDown</code> until lists arrive. Inside a toolbar the field joins the
          toolbar&apos;s Tab stop. Disabled and read-only fields hide the clear button.{' '}
          <code>ref</code> receives the <code>input</code> element, and native input attributes such
          as <code>placeholder</code> pass through. <code>className</code> goes to the outer box and
          is meant only for layout.
        </p>
      </PageSection>
    </>
  );
}
