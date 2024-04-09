module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'import',
    'simple-import-sort',
    'unused-imports',
    'jest',
    'jest-formatting'
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
    'plugin:jest-formatting/recommended'
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-explicit-any': "off",
    'no-unused-vars': 'off', // disabled in favor of "unused-imports/no-unused-vars"
    '@typescript-eslint/no-unused-vars': 'off', // disabled in favor of "unused-imports/no-unused-vars",
    // Enforces naming conventions for everything across a codebase (naming-convention)
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/naming-convention.md
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'default',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        leadingUnderscore: 'allowSingleOrDouble',
      },
      {
        selector: 'variable',
        format: ['PascalCase', 'camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'allowSingleOrDouble',
      },
      {
        selector: 'function',
        format: ['PascalCase', 'camelCase'],
      },
      {
        selector: 'parameter',
        format: ['camelCase', 'snake_case', 'PascalCase'],
        leadingUnderscore: 'allowSingleOrDouble',
      },
      {
        selector: 'property',
        format: ['camelCase', 'PascalCase', 'snake_case'],
        leadingUnderscore: 'allowSingleOrDouble',
      },
      {
        selector: 'property',
        format: null,
        filter: {
          regex: 'aria-[a-z]+',
          match: true,
        },
        leadingUnderscore: 'allowSingleOrDouble',
      },
      {
        selector: ['classProperty', 'classMethod'],
        format: ['camelCase'],
        modifiers: ['private'],
        leadingUnderscore: 'allowSingleOrDouble',
      },
      {
        selector: 'memberLike',
        format: ['camelCase', 'PascalCase'],
        modifiers: ['private'],
        leadingUnderscore: 'allowSingleOrDouble',
      },
      {
        selector: 'objectLiteralProperty',
        format: null,
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
      {
        selector: 'enumMember',
        format: ['camelCase', 'UPPER_CASE'],
      },
    ],

    // Disallow Unused Variables
    // https://eslint.org/docs/rules/no-unused-vars#options
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        args: 'none',
        ignoreRestSiblings: true,
        varsIgnorePattern: '^(jsx$|_)',
        argsIgnorePattern: '^_',
      },
    ],

    // Find and remove unused es6 module imports.
    // https://github.com/sweepline/eslint-plugin-unused-imports
    'unused-imports/no-unused-imports': 'warn',


    // https://github.com/lydell/eslint-plugin-simple-import-sort
    "simple-import-sort/imports": [
      "error",
      {
        "groups": [
          // Packages. (Things that start with a letter (or digit or underscore), or `@` followed by a letter.)
          [ "^@?\\w"],
          // Internal packages.
          ["^api/.*|$"],
          ["^application/.*|$"],
          ["^domain/.*|$"],
          ["^shared-kernel/.*|$"],
          ["^infrastructure/.*|$"],
          // Parent imports. Put `..` last.
          ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
          // Other relative imports. Put same-folder imports and `.` last.
          ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
        ]
      }
    ]
  }
};
