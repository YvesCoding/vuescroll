module.exports = {
  root: true,
  extends: 'eslint:recommended',
  rules: {
    indent: ['error', 2, { MemberExpression: 'off' }],
    semi: ['error', 'always'],
    'no-undef': 0,
    quotes: ['error', 'single'],
    excludedFiles: 'dist/*.js'
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
