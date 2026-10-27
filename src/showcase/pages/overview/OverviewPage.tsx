import { PageSection } from '@/showcase/template/PageSection';

export function OverviewPage() {
  return (
    <>
      <PageSection title="What the framework is">
        <p>
          This is an open framework for building browser-based game engine editors. Its layout and
          behavior follow familiar desktop editors: a main menu, a toolbar, docking panels, windows,
          a status bar, themes and localization.
        </p>
        <p>
          The framework is not tied to any engine. It provides mechanisms: registries for menus,
          toolbar buttons, windows and status bar items, docking, themes, localization and UI
          primitives. An engine developer takes the source code, places it next to the engine and
          adds their own windows, menu items, toolbar buttons, status bar data and translations.
        </p>
        <p>
          Framework code and integration code are kept apart. The integration lives in{' '}
          <code>src/engine/</code>, talks to the engine through interfaces from{' '}
          <code>src/contracts/</code> and extends the framework through registries, never by editing
          framework files. The framework never imports from <code>src/engine/</code>, so framework
          updates arrive through git without conflicts.
        </p>
      </PageSection>
      <PageSection title="How the showcase is organized">
        <p>
          The showcase is the living documentation of the framework. Every UI component and
          mechanism has a page here with a description, a live example and the example source code.
        </p>
        <ul>
          <li>The sidebar lists sections and the pages inside them.</li>
          <li>
            The page address is kept in the URL hash, for example{' '}
            <code>showcase.html#/foundations/colors</code>. Links can be shared, and the browser
            back and forward buttons work.
          </li>
          <li>The theme switcher in the header applies to every page.</li>
          <li>
            The showcase runs only in <code>pnpm dev</code> and is not part of the production build.
          </li>
        </ul>
      </PageSection>
      <PageSection title="How to read a page">
        <p>
          A page starts with a title and a short description: what the thing is and when to use it.
          Sections below explain the details.
        </p>
        <p>
          An example block shows a live demo with its source code underneath. The demo and the code
          are the same file, so they can never drift apart. Examples import the framework through{' '}
          <code>@/</code> paths only and do not depend on the showcase, so you can copy an example
          into your code with the Copy button and it will work as is.
        </p>
      </PageSection>
    </>
  );
}
