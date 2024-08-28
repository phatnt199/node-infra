import { FlatCompat } from '@eslint/eslintrc';
import eslintJs from '@eslint/js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: eslintJs.configs.recommended,
});

export default [
  ...compat.extends('@loopback/eslint-config'),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
    },
    ignores: ['node_modules/', 'dist/', 'coverage/', 'eslint.config.*', '.prettierrc.*'],
  },
];
