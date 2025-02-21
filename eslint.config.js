import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ['src/**/*.{js,mjs,cjs,ts,jsx,tsx}']},
  {languageOptions: {globals: globals.browser}},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-vars': 'error',
      'react-hooks/exhaustive-deps': ['error', {enableDangerousAutofixThisMayCauseInfiniteLoops: true}],
    },
    settings: {react: {version: 'detect'}},
  },
  {plugins: {'react-hooks': pluginReactHooks}},
  {ignores: ['node_modules/', 'dist/']},
];
