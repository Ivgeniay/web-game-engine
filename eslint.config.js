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

const localPlugin = {
  rules: {
    'no-comments': noCommentsRule,
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
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportDefaultDeclaration',
          message: 'Use named exports only.',
        },
        {
          selector: 'ExportSpecifier[exported.name="default"]',
          message: 'Use named exports only.',
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [parentPathImportPattern],
        },
      ],
    },
  },
  {
    files: ['src/**/*Example.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [parentPathImportPattern, ...showcaseImportPatterns],
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
