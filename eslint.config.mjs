import { FlatCompat } from '@eslint/eslintrc';
import eslintJs from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier/recommended';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: eslintJs.configs.recommended,
});

const configs = [
  ...compat.extends('@loopback/eslint-config'),
  prettierPlugin,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-invalid-this': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
    files: ['**/*.js', '**/*.ts'],
  },
  {
    ignores: ['**/node_modules', '**/dist', '**/*.config.*', '**/.prettierrc.*'],
  },
];

export default configs;
