export default [
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': 'warn',
      'no-unused-vars': 'warn',
    },
  },
  {
    ignores: ['dist/', 'node_modules/', 'coverage/', '**/*.ts', '**/*.tsx'],
  },
];
