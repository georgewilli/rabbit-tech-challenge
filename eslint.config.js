import js from '@eslint/js';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import prettier from 'eslint-config-prettier';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'double'],
      semi: ['error', 'always'],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['**/*.json'],
    rules: {
      quotes: ['error', 'double'],
      indent: ['error', 2],
    },
  },
];
