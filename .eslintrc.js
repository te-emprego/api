module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint'
  ],
  'env': {
    'es6': true,
    'node': true
  },
  'extends': [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'standard'
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module'
  },
  'rules': {
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'off'
  }
};