import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

const noCommentsRule = {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      forbidden: 'Comments are not allowed.',
    },
  },
  create(context) {
    return {
      Program() {
        for (const comment of context.sourceCode.getAllComments()) {
          context.report({ loc: comment.loc, messageId: 'forbidden' });
        }
      },
    };
  },
};

const noRawSvgRule = {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      forbidden: 'SVG markup lives only in src/icons/. Show icons with the Icon component.',
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.type === 'JSXIdentifier' && node.name.name === 'svg') {
          context.report({ node, messageId: 'forbidden' });
        }
      },
    };
  },
};

const parentPathImportPattern = {
  regex: '(^|/)\\.\\.(/|$)',
  message: 'Use ./ within the same folder and @/ across folders.',
};

const showcaseImportPatterns = [
  {
    regex: '^@/showcase(/|$)',
    message: 'Examples must not depend on the showcase.',
  },
  {
    regex: '^\\./(?!.*Example)',
    message: 'Examples may import only their own *Example files relatively.',
  },
];

const integrationImportPattern = {
  regex: '^@/(engine|demo)(/|$)',
  message: 'Framework code does not import the integration in src/engine and src/demo.',
};

const showcaseIntegrationImportPatterns = [
  {
    regex: '^@/engine(/|$)',
    message: 'The showcase does not import the engine integration.',
  },
  {
    regex: '^@/demo(/|$)(?!.*\\?raw$)',
    message: 'The showcase imports the demo integration only as source text with ?raw.',
  },
];

const coreImportPatterns = [
  {
    regex: '^@/(ui|state|shell)(/|$)',
    message: 'core does not depend on ui, state and shell. Pass the knowledge as a parameter.',
  },
];

const namedExportsOnlySelectors = [
  {
    selector: 'ExportDefaultDeclaration',
    message: 'Use named exports only.',
  },
  {
    selector: 'ExportSpecifier[exported.name="default"]',
    message: 'Use named exports only.',
  },
];

const uiTextMessage =
  'Interface texts must come from a translation: use useMessages or useTranslate.';

const textAttributePattern =
  '/^(alt|aria-description|aria-label|aria-placeholder|aria-roledescription|aria-valuetext|label|placeholder|title)$/';

const uiTextSelectors = [
  'JSXText[value=/\\S/]',
  ':matches(JSXElement, JSXFragment) > JSXExpressionContainer > Literal[value=/\\S/]',
  ':matches(JSXElement, JSXFragment) > JSXExpressionContainer > TemplateLiteral',
  `JSXAttribute[name.name=${textAttributePattern}] > Literal`,
  `JSXAttribute[name.name=${textAttributePattern}] > JSXExpressionContainer > :matches(Literal, TemplateLiteral)`,
].map((selector) => ({ selector, message: uiTextMessage }));

const localPlugin = {
  rules: {
    'no-comments': noCommentsRule,
    'no-raw-svg': noRawSvgRule,
  },
};

export default defineConfig([
  globalIgnores(['dist', 'docs']),
  {
    plugins: {
      local: localPlugin,
    },
    linterOptions: {
      noInlineConfig: true,
    },
    rules: {
      'local/no-comments': 'error',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      tseslint.configs.strictTypeChecked,
      reactHooks.configs.flat['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      'react-hooks/exhaustive-deps': ['warn', { additionalHooks: '^useRegistration$' }],
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-check': true,
          'ts-expect-error': true,
          'ts-ignore': true,
          'ts-nocheck': true,
        },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': ['error', ...namedExportsOnlySelectors],
      'no-restricted-imports': [
        'error',
        {
          patterns: [parentPathImportPattern],
        },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/engine/**', 'src/demo/**', 'src/showcase/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [parentPathImportPattern, integrationImportPattern],
        },
      ],
    },
  },
  {
    files: ['src/showcase/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [parentPathImportPattern, ...showcaseIntegrationImportPatterns],
        },
      ],
    },
  },
  {
    files: ['src/core/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [parentPathImportPattern, integrationImportPattern, ...coreImportPatterns],
        },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/showcase/**'],
    rules: {
      'no-restricted-syntax': ['error', ...namedExportsOnlySelectors, ...uiTextSelectors],
    },
  },
  {
    files: ['src/**/*.tsx'],
    ignores: ['src/icons/**', 'src/ui/icon/Icon.tsx'],
    rules: {
      'local/no-raw-svg': 'error',
    },
  },
  {
    files: ['src/**/*Example.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [parentPathImportPattern, integrationImportPattern, ...showcaseImportPatterns],
        },
      ],
    },
  },
  {
    files: ['src/app/themeBootstrap.test.ts'],
    rules: {
      '@typescript-eslint/no-implied-eval': 'off',
    },
  },
]);
