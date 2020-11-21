var OFF = 0,
  WARN = 1,
  ERROR = 2;

module.exports = exports = {
  extends: [
    'airbnb',
    'prettier',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  ignorePatterns: ['/build', './src/serviceWorker.ts', 'src/vtkWrapper'],
  parser: '@typescript-eslint/parser',
  plugins: ['prettier'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  },
  rules: {
    'prettier/prettier': ['error', { singleQuote: true }],
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never'
      }
    ],
    // allow console and debugger in development
    'no-console': process.env.NODE_ENV === 'production' ? ERROR : WARN,
    'no-debugger': process.env.NODE_ENV === 'production' ? ERROR : WARN,
    // warn: Something is defined but never used
    'no-unused-vars': [WARN, { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
    // warn: Prefer default export
    'import/prefer-default-export': WARN,
    // warn: Something is already declared in the upper scope
    'no-shadow': [WARN, { builtinGlobals: false, hoist: 'functions', allow: [] }],
    // Interface name must not be prefixed with "I"  @typescript-eslint/interface-name-prefix
    '@typescript-eslint/interface-name-prefix': [
      'error',
      {
        prefixWithI: 'always'
      }
    ],
    'no-console': 'off',
    'no-alert': 'off',
    'max-len': ['error', { code: 100 }],
    // disable the rule for all files
    '@typescript-eslint/explicit-function-return-type': 'off'
  },
  overrides: [
    {
      // enable the rule specifically for TypeScript files
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': ['error']
      }
    }
  ],
  env: {
    browser: true,
    jest: true
  }
};
