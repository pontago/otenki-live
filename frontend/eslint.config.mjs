// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format

import { dirname } from 'path';
import { fileURLToPath } from 'url';

import eslint from '@eslint/js';
import nextVitals from 'eslint-config-next/core-web-vitals';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import storybook from 'eslint-plugin-storybook';
import unusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// eslint-disable-next-line @typescript-eslint/no-deprecated
export default tseslint.config(
  {
    files: ['*.ts', '*.tsx'],
  },
  {
    ignores: ['**/.next/**/*', 'public/**/*', 'coverage/**/*', 'storybook-static/**/*'],
  },
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  nextVitals,
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
    },
  },
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal'],
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'always',
          pathGroups: [
            { pattern: '@/components/**', group: 'internal', position: 'before' },
            { pattern: '@/libs/**', group: 'internal', position: 'before' },
          ],
        },
      ],
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
    },
  },
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'unused-imports/no-unused-imports': 'error',
    },
  },
  {
    files: ['app/**/*.tsx'],
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    languageOptions: {
      globals: {
        React: 'readonly',
      },
    },
    rules: {
      'react/jsx-boolean-value': 'error',
      'react/jsx-curly-brace-presence': 'error',
    },
  },
  eslintConfigPrettier,
  storybook.configs['flat/recommended']
);
