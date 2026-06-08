import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export const sharedImportRules = {
  plugins: {
    import: importPlugin,
    'simple-import-sort': simpleImportSort,
  },
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
    'import/internal-regex': '^@package/',
  },
  rules: {
    // Simple import sort (auto-fixable)
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // React first
          ['^react'],
          // External packages
          ['^@?\\w'],
          // Internal packages (@package/*)
          ['^@package/'],
          // Relative imports: ../, ./, and /
          ['^\\.\\./', '^\\./', '^/'],
          // Style imports (must be last)
          ['^.+\\.css$'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
    'import/newline-after-import': ['error', { count: 1 }],

    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
    ],

    // Enforce workspace aliases for package imports
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['packages', 'packages/*', 'packages/**'],
            message: 'Use workspace aliases (@package/*) instead of direct package paths.',
          },
          {
            group: ['@package/*/*', '@package/*/**'],
            message: 'Import from package root only: @package/utils (not @package/utils/subpath).',
          },
          {
            group: ['**/node_modules/@package/*', 'node_modules/@package/*'],
            message: 'Use workspace aliases (@package/*) instead of node_modules paths.',
          },
          {
            group: ['**/packages/*', '**/packages/**/*'],
            message: 'Use workspace aliases (@package/*) instead of relative paths to packages.',
          },
        ],
      },
    ],
  },
};
