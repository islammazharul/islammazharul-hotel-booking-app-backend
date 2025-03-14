import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
// import jsdoc from 'eslint-plugin-jsdoc';
// import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  { languageOptions: { globals: globals.browser } },

  {
    rules: {
      eqeqeq: 'off',
      'no-unused-vars': 'error',
      'prefer-const': ['error', { ignoreReadBeforeAssign: true }],
      'no-console': 'warn',
      'no-undef': 'error',
      'no-unused-expressions': 'error',
      '@typescript-eslint/no-this-alias': 'error',
    },
  },
  {
    ignores: ['**/temp.js', 'config/*'],
  },

  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  // eslintPluginPrettierRecommended,

  // {
  //   files: ['**/*.js'],
  //   plugins: {
  //     jsdoc: jsdoc,
  //   },
  //   rules: {
  //     'jsdoc/require-description': 'error',
  //     'jsdoc/check-values': 'error',
  //   },
  // },
];
