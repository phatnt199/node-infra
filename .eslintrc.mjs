const config = {
  extends: '@loopback/eslint-config',
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
  },
}

export default config;
