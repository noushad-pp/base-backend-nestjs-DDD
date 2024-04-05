import { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  // preset
  preset: 'ts-jest',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  testRegex: '.*\\..*spec\\.ts$',
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    // to resolve aliases
    '^api(.*)$': '<rootDir>/src/api$1',
    '^domain(.*)$': '<rootDir>/src/domain$1',
    '^shared-kernel(.*)$': '<rootDir>/src/shared-kernel$1',
    '^infrastructure(.*)$': '<rootDir>/src/infrastructure$1',
  },

  // Configs
  testEnvironment: 'node',
  clearMocks: true,
  verbose: false,
  detectOpenHandles: true,
  errorOnDeprecated: true,
  globals: {
    NODE_ENV: 'test',
  },

  // Coverage related
  coverageDirectory: '../coverage',
  collectCoverageFrom: ['<rootDir>/src/**/*.(t|j)s', '<rootDir>/test/**/*.(t|j)s'],
  coverageThreshold: {
    global: {
      branches: 85, // FIXME: increase back to 90 when infrastructure code is better covered
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  coveragePathIgnorePatterns: [
    // file types
    'main.ts',
    'index.ts',
    '.module.ts',
    '.cli.ts',
    '.d.ts',
    '.interface*.ts',
    '.type*.ts',
    '.enum*.ts',
    '.fixture.ts',
    'jest.config.ts',
    // folders
    'infrastructure/storage/database/migration',
  ],
};

export default jestConfig;
