import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import babelParser from '@babel/eslint-parser';
import jsxPlugin from '@babel/plugin-syntax-jsx';

export default [
  {
    files: [ '**/*.{js,jsx}' ],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          plugins: [ jsxPlugin ],
        },
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react: pluginReact,
    },
    rules: {
      'indent': [ 'error', 2 ],
      'quotes': [ 'error', 'single' ],
      'semi': [ 'error', 'always' ],
      'no-unused-vars': [ 'warn' ],
      'no-console': [ 'warn' ],
      'comma-dangle': [ 'error', 'always-multiline' ],
      'space-before-function-paren': [ 'error', 'never' ],
      'object-curly-spacing': [ 'error', 'always' ],
      'array-bracket-spacing': [ 'error', 'always' ],
      'key-spacing': [ 'error', { 'beforeColon': false, 'afterColon': true } ],
      'space-infix-ops': [ 'error' ],
      'eol-last': [ 'error' ],
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
