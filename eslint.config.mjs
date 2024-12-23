import minimaltechLinter from '@minimaltech/eslint-node';

const configs = [
  ...minimaltechLinter,
  {
    rules: {
      'no-dupe-class-members': 'off',

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-dupe-class-members': 'off',
    },
  },
];

export default configs;
