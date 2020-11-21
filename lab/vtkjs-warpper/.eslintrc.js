var OFF = 0,
  WARN = 1,
  ERROR = 2;

module.exports = exports = {
  extends: [
    'airbnb',
    'prettier',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['prettier'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  ignorePatterns: ['node_modules/', 'build'],
  rules: {
    'prettier/prettier': ['error'],
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
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
        prefixWithI: 'always',
      },
    ],
  },
  overrides: [
    {
      // for custom classes of vtk.js
      files: ['./src/customVtkjs/**/*.js'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'no-multi-spaces': ['error', { exceptions: { ImportDeclaration: true } }],
        'no-param-reassign': ['error', { props: false }],
        'no-unused-vars': ['error', { args: 'none' }],
        'prefer-destructuring': [
          'error',
          {
            VariableDeclarator: { array: false, object: true },
            AssignmentExpression: { array: false, object: false },
          },
          { enforceForRenamedProperties: false },
        ],
        'jsx-a11y/label-has-for': 0,
        'no-console': 0,
        'no-plusplus': 0,
        'import/no-named-as-default': 0,
        'import/no-named-as-default-member': 0,
        'prefer-destructuring': 0, // Can have unwanted side effect
      },
    },
  ],
  env: {
    browser: true,
    jest: true,
  },
};
