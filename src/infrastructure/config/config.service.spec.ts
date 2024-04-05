import { ConfigService } from './config.service';

describe(`${ConfigService.name}`, () => {
  let subject: ConfigService;

  const originalProcessEnv = process.env;

  beforeEach(() => {
    jest.resetModules();

    process.env = { ...originalProcessEnv };

    delete process.env.NODE_ENV;
    delete process.env.LOGGER_LOG_LEVEL;
    delete process.env.DATABASE_HOST;
    delete process.env.DATABASE_PORT;
    delete process.env.DATABASE_DATABASE;
    delete process.env.DATABASE_USERNAME;
    delete process.env.DATABASE_PASSWORD;
    delete process.env.KAFKA_CONSUMER_CITY_TOPIC;
    delete process.env.KAFKA_CONSUMER_CITY_GROUP_ID;
    delete process.env.KAFKA_CONSUMER_LINE_TOPIC;
    delete process.env.KAFKA_CONSUMER_LINE_GROUP_ID;

    subject = new ConfigService();
  });

  afterEach(() => {
    process.env = originalProcessEnv;
  });

  describe('getLogLevelConfig', () => {
    const testCases = [
      {
        case: 'when set to error',
        logLevelEnv: 'error',
        expectedLogLevel: 'error',
      },
      {
        case: 'when set to warn',
        logLevelEnv: 'warn',
        expectedLogLevel: 'warn',
      },
      {
        case: 'when set to INFO',
        logLevelEnv: 'info',
        expectedLogLevel: 'info',
      },
      {
        case: 'when set to debug',
        logLevelEnv: 'debug',
        expectedLogLevel: 'debug',
      },
      {
        case: 'when not defined',
        expectedLogLevel: 'info',
      },
      {
        case: 'when not defined in test',
        nodeEnv: 'test',
        expectedLogLevel: 'warn',
      },
    ];

    it.each(testCases)('$case', async ({ logLevelEnv, expectedLogLevel, nodeEnv }) => {
      process.env.NODE_ENV = nodeEnv;
      process.env.LOGGER_LOG_LEVEL = logLevelEnv;

      const actualLogLevel = subject.getLogLevelConfig();

      expect(actualLogLevel).toEqual(expectedLogLevel);
    });
  });

  describe('isDevEnvironment', () => {
    const testCases = [
      {
        nodeEnv: 'development',
        expected: true,
      },
      {
        nodeEnv: 'test',
        expected: false,
      },
      {
        nodeEnv: 'production',
        expected: false,
      },
      {
        nodeEnv: 'something-else',
        expected: false,
      },
      {
        expected: false,
      },
    ];

    it.each(testCases)('$nodeEnv', async ({ nodeEnv, expected }) => {
      process.env.NODE_ENV = nodeEnv;

      const isDevEnvironment = subject.isDevEnvironment();

      expect(isDevEnvironment).toEqual(expected);
    });
  });

  describe('isProdEnvironment', () => {
    const testCases = [
      {
        nodeEnv: 'development',
        expected: false,
      },
      {
        nodeEnv: 'test',
        expected: false,
      },
      {
        nodeEnv: 'production',
        expected: true,
      },
      {
        nodeEnv: 'something-else',
        expected: true,
      },
      {
        expected: true,
      },
    ];

    it.each(testCases)('$nodeEnv', async ({ nodeEnv, expected }) => {
      process.env.NODE_ENV = nodeEnv;

      const isDevEnvironment = subject.isProdEnvironment();

      expect(isDevEnvironment).toEqual(expected);
    });
  });

  describe('isTestEnvironment', () => {
    const testCases = [
      {
        nodeEnv: 'development',
        expected: false,
      },
      {
        nodeEnv: 'test',
        expected: true,
      },
      {
        nodeEnv: 'production',
        expected: false,
      },
      {
        nodeEnv: 'something-else',
        expected: false,
      },
      {
        expected: false,
      },
    ];

    it.each(testCases)('$nodeEnv', async ({ nodeEnv, expected }) => {
      process.env.NODE_ENV = nodeEnv;

      const isDevEnvironment = subject.isTestEnvironment();

      expect(isDevEnvironment).toEqual(expected);
    });
  });

  describe('getDatabaseConfig', () => {
    const testCases = [
      {
        case: 'all values are given',
        nodeEnv: 'production',
        input: {
          databaseHost: 'databaseHost',
          databasePort: '1234',
          databaseDatabase: 'db_table',
          databaseUsername: 'username',
          databasePassword: 'password',
        },
        expected: {
          databaseHost: 'databaseHost',
          databasePort: 1234,
          databaseDatabase: 'database',
          databaseUsername: 'username',
          databasePassword: 'password',
          synchronize: false,
        },
      },
      {
        case: 'using default values',
        nodeEnv: 'production',
        input: {},
        expected: {
          databaseHost: 'localhost',
          databasePort: 3306,
          databaseDatabase: 'business_rules',
          databaseUsername: 'root',
          databasePassword: 'root',
          synchronize: false,
        },
      },
      {
        case: 'all values are given',
        nodeEnv: 'test',
        input: {
          databaseHost: 'databaseHost',
          databasePort: '1234',
          databaseDatabase: 'db_table',
          databaseUsername: 'username',
          databasePassword: 'password',
        },
        expected: {
          databaseHost: 'databaseHost',
          databasePort: 1234,
          databaseDatabase: 'db_table',
          databaseUsername: 'username',
          databasePassword: 'password',
          synchronize: true,
        },
      },
      {
        case: 'using defaults',
        nodeEnv: 'test',
        input: {},
        expected: {
          databaseHost: 'localhost',
          databaseHostRo: 'localhost',
          databasePort: 3306,
          databaseDatabase: 'business_rules',
          databaseUsername: 'root',
          databasePassword: 'root',
          synchronize: true,
        },
      },
    ];

    it.each(testCases)('in $nodeEnv and $case', async ({ nodeEnv, input, expected }) => {
      process.env.NODE_ENV = nodeEnv;
      process.env.DATABASE_HOST = input.databaseHost;
      process.env.DATABASE_PORT = input.databasePort;
      process.env.DATABASE_DATABASE = input.databaseDatabase;
      process.env.DATABASE_USERNAME = input.databaseUsername;
      process.env.DATABASE_PASSWORD = input.databasePassword;

      const databaseConfig = subject.getDatabaseConfig();

      expect(databaseConfig.synchronize).toEqual(expected.synchronize);

      const databaseNamePrefix = input.databaseDatabase || 'ppeedikayil_core';
      const databaseName = nodeEnv === 'test' ? `${databaseNamePrefix}_test` : databaseNamePrefix;

      expect(databaseConfig.host).toEqual(expected.databaseHost);
      expect(databaseConfig.port).toEqual(expected.databasePort);
      expect(databaseConfig.database).toEqual(databaseName);
      expect(databaseConfig.username).toEqual(expected.databaseUsername);
      expect(databaseConfig.password).toEqual(expected.databasePassword);
    });
  });
});
