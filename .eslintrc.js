module.exports = {
  root: true,
  extends: 'eslint:recommended',
  parser: 'babel-eslint',
  rules: {
    semi: ['error', 'always'],
    'no-undef': 0,
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^h$',
        varsIgnorePattern: '^h$'
      }
    ],
    quotes: ['error', 'single'],
    excludedFiles: 'dist/*.js'.anchor,
    'no-console': [0],
    indent: 0
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true
    }
  }
};
