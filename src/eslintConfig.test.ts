import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

const LINT_TIMEOUT_MS = 60_000;

const FRAMEWORK_TS_FILE = 'src/ui/classNames.ts';
const FRAMEWORK_TSX_FILE = 'src/ui/kbd/Kbd.tsx';
const SHOWCASE_TSX_FILE = 'src/showcase/Showcase.tsx';
const EXAMPLE_FILE = 'src/showcase/pages/foundations/themes/ThemeModeExample.tsx';
const ICON_COMPONENT_FILE = 'src/ui/icon/Icon.tsx';
const CORE_FILE = 'src/core/unsubscribe.ts';
const CORE_TEST_FILE = 'src/core/registry/registry.test.ts';
const SHELL_FILE = 'src/shell/EditorFrame.tsx';
const DEMO_FILE = 'src/demo/demoExtension.ts';

interface ForbiddenCase {
  readonly name: string;
  readonly filePath: string;
  readonly code: string;
  readonly ruleId: string;
}

interface AllowedCase {
  readonly name: string;
  readonly filePath: string;
  readonly code: string;
}

const eslint = new ESLint();

async function lintRuleIds(filePath: string, code: string): Promise<(string | null)[]> {
  const results = await eslint.lintText(code, { filePath });

  return results.flatMap((result) => result.messages.map((message) => message.ruleId));
}

const FORBIDDEN_CASES: readonly ForbiddenCase[] = [
  {
    name: 'a line comment',
    filePath: FRAMEWORK_TS_FILE,
    code: 'export const value = 1; // note\n',
    ruleId: 'local/no-comments',
  },
  {
    name: 'a block comment',
    filePath: FRAMEWORK_TS_FILE,
    code: '/** Docs. */\nexport const value = 1;\n',
    ruleId: 'local/no-comments',
  },
  {
    name: 'a disable directive, which does not turn the rule off',
    filePath: FRAMEWORK_TS_FILE,
    code: '/* eslint-disable no-restricted-syntax */\nexport default 1;\n',
    ruleId: 'no-restricted-syntax',
  },
  {
    name: 'a @ts-ignore directive',
    filePath: FRAMEWORK_TS_FILE,
    code: '// @ts-ignore\nexport const value = 1;\n',
    ruleId: '@typescript-eslint/ban-ts-comment',
  },
  {
    name: 'a @ts-expect-error directive',
    filePath: FRAMEWORK_TS_FILE,
    code: '// @ts-expect-error\nexport const value: number = 1;\n',
    ruleId: '@typescript-eslint/ban-ts-comment',
  },
  {
    name: 'an import through ../',
    filePath: FRAMEWORK_TS_FILE,
    code: "import { Kbd } from '../kbd/Kbd';\nexport const value = Kbd;\n",
    ruleId: 'no-restricted-imports',
  },
  {
    name: 'a default export',
    filePath: FRAMEWORK_TS_FILE,
    code: 'const value = 1;\nexport default value;\n',
    ruleId: 'no-restricted-syntax',
  },
  {
    name: 'a default export through a specifier',
    filePath: FRAMEWORK_TS_FILE,
    code: 'const value = 1;\nexport { value as default };\n',
    ruleId: 'no-restricted-syntax',
  },
  {
    name: 'text in JSX outside the showcase',
    filePath: FRAMEWORK_TSX_FILE,
    code: 'export function Hint() {\n  return <span>Save</span>;\n}\n',
    ruleId: 'no-restricted-syntax',
  },
  {
    name: 'a string literal among JSX children outside the showcase',
    filePath: FRAMEWORK_TSX_FILE,
    code: "export function Hint() {\n  return <span>{'Save'}</span>;\n}\n",
    ruleId: 'no-restricted-syntax',
  },
  {
    name: 'a literal aria-label outside the showcase',
    filePath: FRAMEWORK_TSX_FILE,
    code: 'export function Hint() {\n  return <span aria-label="Save" />;\n}\n',
    ruleId: 'no-restricted-syntax',
  },
  {
    name: 'a literal label prop outside the showcase',
    filePath: FRAMEWORK_TSX_FILE,
    code: 'import { Toolbar } from \'@/ui/toolbar/Toolbar\';\nexport function Bar() {\n  return <Toolbar label="Scene">{null}</Toolbar>;\n}\n',
    ruleId: 'no-restricted-syntax',
  },
  {
    name: 'an svg element outside the icon component',
    filePath: FRAMEWORK_TSX_FILE,
    code: 'export function Mark() {\n  return <svg />;\n}\n',
    ruleId: 'local/no-raw-svg',
  },
  {
    name: 'an svg element in the showcase',
    filePath: SHOWCASE_TSX_FILE,
    code: 'export function Mark() {\n  return <svg />;\n}\n',
    ruleId: 'local/no-raw-svg',
  },
  {
    name: 'an example importing the showcase',
    filePath: EXAMPLE_FILE,
    code: "import { PageSection } from '@/showcase/template/PageSection';\nexport const value = PageSection;\n",
    ruleId: 'no-restricted-imports',
  },
  {
    name: 'an example importing a relative file that is not an example',
    filePath: EXAMPLE_FILE,
    code: "import { helper } from './helper';\nexport const value = helper;\n",
    ruleId: 'no-restricted-imports',
  },
  {
    name: 'an example importing through ../',
    filePath: EXAMPLE_FILE,
    code: "import { IconsPage } from '../icons/IconsPage';\nexport const value = IconsPage;\n",
    ruleId: 'no-restricted-imports',
  },
  {
    name: 'a core module importing ui',
    filePath: CORE_FILE,
    code: "import { classNames } from '@/ui/classNames';\nexport const value = classNames;\n",
    ruleId: 'no-restricted-imports',
  },
  {
    name: 'a core module importing state',
    filePath: CORE_FILE,
    code: "import { useTranslate } from '@/state/language/useTranslate';\nexport const value = useTranslate;\n",
    ruleId: 'no-restricted-imports',
  },
  {
    name: 'a core module importing shell',
    filePath: CORE_FILE,
    code: "import { MenuBar } from '@/shell/MenuBar';\nexport const value = MenuBar;\n",
    ruleId: 'no-restricted-imports',
  },
  {
    name: 'a core test importing ui',
    filePath: CORE_TEST_FILE,
    code: "import { POPUP_LAYER_ID } from '@/ui/popup/popupLayerAttributes';\nexport const value = POPUP_LAYER_ID;\n",
    ruleId: 'no-restricted-imports',
  },
  {
    name: 'framework code importing the demo integration',
    filePath: SHELL_FILE,
    code: "import { installDemo } from '@/demo/demoExtension';\nexport const value = installDemo;\n",
    ruleId: 'no-restricted-imports',
  },
  {
    name: 'framework code importing the engine integration',
    filePath: FRAMEWORK_TS_FILE,
    code: "import { engine } from '@/engine/engine';\nexport const value = engine;\n",
    ruleId: 'no-restricted-imports',
  },
  {
    name: 'framework code importing the demo integration as source text',
    filePath: FRAMEWORK_TS_FILE,
    code: "import source from '@/demo/demoExtension.ts?raw';\nexport const value = source;\n",
    ruleId: 'no-restricted-imports',
  },
  {
    name: 'a core module importing the demo integration',
    filePath: CORE_FILE,
    code: "import { installDemo } from '@/demo/demoExtension';\nexport const value = installDemo;\n",
    ruleId: 'no-restricted-imports',
  },
  {
    name: 'the showcase importing demo code without ?raw',
    filePath: SHOWCASE_TSX_FILE,
    code: "import { installDemo } from '@/demo/demoExtension';\nexport const value = installDemo;\n",
    ruleId: 'no-restricted-imports',
  },
  {
    name: 'the showcase importing the engine integration as source text',
    filePath: SHOWCASE_TSX_FILE,
    code: "import source from '@/engine/engine.ts?raw';\nexport const value = source;\n",
    ruleId: 'no-restricted-imports',
  },
  {
    name: 'an example importing the demo integration as source text',
    filePath: EXAMPLE_FILE,
    code: "import source from '@/demo/demoExtension.ts?raw';\nexport const value = source;\n",
    ruleId: 'no-restricted-imports',
  },
  {
    name: 'a core module importing through ../',
    filePath: CORE_FILE,
    code: "import { createRegistry } from '../core/registry/registry';\nexport const value = createRegistry;\n",
    ruleId: 'no-restricted-imports',
  },
];

const ALLOWED_CASES: readonly AllowedCase[] = [
  {
    name: 'framework code that follows the rules',
    filePath: FRAMEWORK_TSX_FILE,
    code: "import { Kbd } from '@/ui/kbd/Kbd';\n\ninterface HintProps {\n  readonly shortcut: string;\n}\n\nexport function Hint({ shortcut }: HintProps) {\n  return <Kbd>{shortcut}</Kbd>;\n}\n",
  },
  {
    name: 'text in JSX in the showcase',
    filePath: SHOWCASE_TSX_FILE,
    code: 'export function Hint() {\n  return <span aria-label="Save">Save</span>;\n}\n',
  },
  {
    name: 'an svg element in the icon component',
    filePath: ICON_COMPONENT_FILE,
    code: 'export function Mark() {\n  return <svg />;\n}\n',
  },
  {
    name: 'an example importing the framework and its own example files',
    filePath: EXAMPLE_FILE,
    code: "import { Kbd } from '@/ui/kbd/Kbd';\nimport { CurrentThemeExample } from './CurrentThemeExample';\n\nconst SHORTCUT = 'Ctrl+S';\n\nexport function ShortcutExample() {\n  return (\n    <>\n      <CurrentThemeExample />\n      <Kbd>{SHORTCUT}</Kbd>\n    </>\n  );\n}\n",
  },
  {
    name: 'the showcase importing demo code as source text',
    filePath: SHOWCASE_TSX_FILE,
    code: "import source from '@/demo/demoExtension.ts?raw';\nexport const value = source;\n",
  },
  {
    name: 'the demo integration importing the framework and itself',
    filePath: DEMO_FILE,
    code: "import { combineUnsubscribes } from '@/core/unsubscribe';\nimport { demoMessages } from '@/demo/demoMessages';\n\nexport const values = [combineUnsubscribes, demoMessages];\n",
  },
  {
    name: 'a core module importing core and icons',
    filePath: CORE_FILE,
    code: "import { createRegistry } from '@/core/registry/registry';\nimport { frameworkIcons } from '@/icons/frameworkIcons';\n\nexport const values = [createRegistry, frameworkIcons];\n",
  },
];

describe('ESLint configuration', { timeout: LINT_TIMEOUT_MS }, () => {
  it.each(FORBIDDEN_CASES)('reports $name', async ({ filePath, code, ruleId }) => {
    expect(await lintRuleIds(filePath, code)).toContain(ruleId);
  });

  it.each(ALLOWED_CASES)('accepts $name', async ({ filePath, code }) => {
    expect(await lintRuleIds(filePath, code)).toEqual([]);
  });
});
