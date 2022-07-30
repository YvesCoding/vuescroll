module.exports = {
  root: true,
  extends: 'eslint:recommended',
  parser: 'babel-eslint',
  rules: {
    indent: ['error', 4, { MemberExpression: 'off' }],
    semi: ['error', 'always'],
    'no-undef': 0,
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^h$'
      }
    ],
    quotes: ['error', 'single'],
    excludedFiles: 'dist/*.js'.anchor,
    'no-console': [0]
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
