import { Example } from '@/showcase/template/Example';
import { PageSection } from '@/showcase/template/PageSection';
import { CurrentThemeExample } from './CurrentThemeExample';
import currentThemeSource from './CurrentThemeExample.tsx?raw';
import { ThemeModeExample } from './ThemeModeExample';
import themeModeStyles from './ThemeModeExample.module.css?raw';
import themeModeSource from './ThemeModeExample.tsx?raw';
import { TokenStyledPanelExample } from './TokenStyledPanelExample';
import tokenStyledPanelStyles from './TokenStyledPanelExample.module.css?raw';
import tokenStyledPanelSource from './TokenStyledPanelExample.tsx?raw';

export function ThemesPage() {
  return (
    <>
      <PageSection title="Theme modes">
        <p>The editor has three theme modes:</p>
        <ul>
          <li>
            <code>dark</code> is the default;
          </li>
          <li>
            <code>light</code>;
          </li>
          <li>
            <code>system</code> follows the operating system preference and updates when it changes.
          </li>
        </ul>
        <p>
          The mode is stored in <code>localStorage</code> under the <code>editor-theme-mode</code>{' '}
          key. The resolved theme, <code>dark</code> or <code>light</code>, is written to the{' '}
          <code>data-theme</code> attribute of the root element. An inline script in the HTML file
          sets it before the first paint, and <code>startThemeController()</code> keeps it in sync
          afterwards. The editor and the showcase entry points already call it.
        </p>
      </PageSection>
      <PageSection title="Reading the current theme">
        <p>
          Read the theme with <code>useThemeStore</code> and a selector. <code>mode</code> is what
          the user picked, <code>resolvedTheme</code> is the theme actually shown. With the{' '}
          <code>system</code> mode they differ.
        </p>
        <p>
          Most components never need this: differences between themes belong in token values, not in
          component code.
        </p>
        <Example sources={[{ fileName: 'CurrentThemeExample.tsx', code: currentThemeSource }]}>
          <CurrentThemeExample />
        </Example>
      </PageSection>
      <PageSection title="Changing the mode">
        <p>
          Call <code>setMode</code> from the store. It saves the mode, resolves the theme and starts
          or stops following the system preference. <code>THEME_MODES</code> lists every mode.
        </p>
        <Example
          sources={[
            { fileName: 'ThemeModeExample.tsx', code: themeModeSource },
            { fileName: 'ThemeModeExample.module.css', code: themeModeStyles },
          ]}
        >
          <ThemeModeExample />
        </Example>
        <p>
          Outside React, use <code>themeStore</code> from <code>@/state/theme/theme</code>:{' '}
          <code>getState()</code> reads the state and <code>subscribe()</code> listens to changes.
        </p>
      </PageSection>
      <PageSection title="Styling with tokens">
        <p>
          Components are styled with CSS Modules. Colors, spacing, font sizes, radii, shadows and
          z-index values come only from token variables through <code>var()</code>. Components know
          nothing about the current theme: switching it changes token values, and every component
          follows.
        </p>
        <ul>
          <li>
            Tokens are named by role, not by value, and grouped by prefix: <code>--color-</code>,{' '}
            <code>--space-</code>, <code>--font-</code>, <code>--size-</code>,{' '}
            <code>--radius-</code>, <code>--shadow-</code>, <code>--z-</code>,{' '}
            <code>--duration-</code>, <code>--easing-</code>.
          </li>
          <li>
            Status colors <code>--color-status-*</code> are for icons, borders and indicators only.
            Text always uses <code>--color-text-*</code>.
          </li>
        </ul>
        <Example
          sources={[
            { fileName: 'TokenStyledPanelExample.tsx', code: tokenStyledPanelSource },
            { fileName: 'TokenStyledPanelExample.module.css', code: tokenStyledPanelStyles },
          ]}
        >
          <TokenStyledPanelExample />
        </Example>
      </PageSection>
    </>
  );
}
