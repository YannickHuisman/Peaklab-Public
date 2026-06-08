// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const { sharedImportRules } = require('../../eslint.shared.config.js');

// Extract settings (expo already provides the import plugin, so we exclude it)
const { plugins: _plugins, ...sharedConfigWithoutPlugins } = sharedImportRules;

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    ...sharedConfigWithoutPlugins,
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...sharedImportRules.rules,
    },
  },
]);
