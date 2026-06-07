const globals = require('globals');

module.exports = [
  {
    files: [ '**/*.js' ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.commonjs,
      },
    },
    rules: {
      'indent': [ 'error', 2 ],
      'quotes': [ 'error', 'single' ],
      'semi': [ 'error', 'always' ],
      'no-unused-vars': [ 'warn', { 'argsIgnorePattern': '^_' } ],
      'no-console': [ 'warn' ],
      'comma-dangle': [ 'error', 'always-multiline' ],
      'space-before-function-paren': [ 'error', 'never' ],
      'object-curly-spacing': [ 'error', 'always' ],
      'array-bracket-spacing': [ 'error', 'always' ],
      'key-spacing': [ 'error', { 'beforeColon': false, 'afterColon': true } ],
      'space-infix-ops': [ 'error' ],
      'eol-last': [ 'error' ],
    },
  },
];
