module.exports = {
    root: true,
    extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended'],
    plugins: ['@typescript-eslint'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  }