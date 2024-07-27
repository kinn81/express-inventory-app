const prettier = require('eslint-plugin-prettier');
const globals = require('globals');
const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.express,
      },
    },
    plugins: {
      prettier: prettier,
    },
    rules: {
      'prettier/prettier': [
        'warn',
        {
          endOfLine: 'auto',
          singleQuote: true,
          trailingComma: 'es5',
          printWidth: 100,
          tabWidth: 2,
        },
      ],
      'no-unused-vars': ['error', { argsIgnorePattern: '^next$' }],
      indent: ['error', 2],
      'no-empty': 'off',
    },
  },
  {
    ignores: ['build/*', 'dist/*', 'node_modules/*'],
  },
];
