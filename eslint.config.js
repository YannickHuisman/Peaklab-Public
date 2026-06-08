import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import { sharedImportRules } from './eslint.shared.config.js';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/node_modules/**',
      '**/.turbo/**',
      '**/.next/**',
      '**/coverage/**',
      '**/.expo/**',
      '**/scripts/**', // Ignore script files that use CommonJS
      '**/*.config.js', // Ignore config files
      '**/*.cjs', // Ignore CommonJS files
      '.lintstagedrc.js',
      'commitlint.config.js',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    ...sharedImportRules,
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...sharedImportRules.rules,

      // TypeScript specific
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-require-imports': 'off', // Allow require in some files

      // General rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'warn',
      'no-var': 'error',
      eqeqeq: ['error', 'always'],

      // Code style (handled by Prettier)
      'prettier/prettier': 'warn',
    },
  }
);
