module.exports = {
  root: true,
  extends: [
    'expo', // base Expo config (includes React Native + TS support)
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
  ],
  plugins: [
    '@typescript-eslint',
    'import',
    'jsx-a11y',
  ],
  ignorePatterns: ['/dist/*', 'node_modules', 'android', 'ios', '/scripts/**'],
  rules: {
    'no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react/react-in-jsx-scope': 'off', // React 17+
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
