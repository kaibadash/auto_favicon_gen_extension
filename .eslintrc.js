'use strict';

module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    webextensions: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/warnings',
    'plugin:import/errors',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  plugins: [
    '@typescript-eslint',
    'prettier',
    'import',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    'sourceType': 'module',
    'project': './tsconfig.json'
  },
  rules: {
    'prettier/prettier': 'warn',

    // plugin import
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
  },
}
