import minimaltechLinter from '@minimaltech/eslint-node';

const configs = [
  ...minimaltechLinter,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/naming-convention': 'warn',
      '@typescript-eslint/naming-convention': [
        'warn',
        {
          selector: 'interface',
          format: ['PascalCase'],
          prefix: ['I'],
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
          prefix: ['T', 'Type'],
        },
        {
          selector: 'default',
          format: ['camelCase', 'PascalCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        {
          selector: 'memberLike',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'variableLike',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        {
          selector: 'variable',
          types: ['boolean'],
          format: ['PascalCase'],
          prefix: ['is', 'should', 'has', 'use', 'can', 'did', 'will', 'do', 'b'],
        },
        {
          selector: 'property',
          format: ['PascalCase'],
          filter: { regex: '[-]', match: true },
        },
        {
          selector: ['objectLiteralProperty', 'objectLiteralMethod'],
          format: null,
          modifiers: ['requiresQuotes'],
        },
      ],
    },
  },
];

export default configs;
