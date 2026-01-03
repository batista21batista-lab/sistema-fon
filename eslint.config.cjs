// Minimal flat config compatible with ESLint v9
module.exports = [
  {
    languageOptions: {
      ecmaVersion: 12,
      sourceType: 'script',
      globals: {
        module: 'readonly',
        require: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly'
      }
    },
    settings: {},
    rules: {
      'no-console': 'off',
      'semi': ['error', 'always']
    }
  }
];
