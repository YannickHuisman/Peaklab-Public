import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { sharedImportRules } from '../../eslint.shared.config.js';

export default tseslint.config(
  { ignores: ['dist', '*.config.ts', '*.config.js', 'plugins/**', 'public/**'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: './tsconfig.app.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      ...sharedImportRules.plugins,
    },
    settings: {
      ...sharedImportRules.settings,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      ...sharedImportRules.rules,
    },
  }
);
