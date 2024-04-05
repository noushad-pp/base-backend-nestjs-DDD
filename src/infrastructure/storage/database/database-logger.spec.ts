import { createMock } from '@golevelup/ts-jest';
import { LoggerService } from '@nestjs/common';

import { LoggerModule } from '../../logger/logger.module';

import { DatabaseLogger, TypeormLogLevelEnum } from './database-logger';

describe('DatabaseLogger', () => {
  let fakeLogger: LoggerService;
  let subject: DatabaseLogger;

  const context = 'database';
  const query = 'SELECT * FROM table_name WHERE field1 = :param AND field2 = :param';
  const parameters = ['PARAM1', 'PARAM2'];
  const formattedQueryWithParameters = `${query} -- PARAMETERS: ${JSON.stringify(parameters)}`;

  const param1: Record<string, unknown> = { reference: undefined };
  const param2: Record<string, unknown> = { reference: undefined };

  param1.reference = param2;
  param2.reference = param1;

  const invalidParams = [param1, param2];
  const formattedQueryWithInvalidParameters = `${query} -- PARAMETERS: [object Object],[object Object]`;

  beforeEach(() => {
    fakeLogger = createMock<LoggerService>();

    jest.spyOn(LoggerModule, 'createLogger').mockReturnValue(fakeLogger);

    subject = new DatabaseLogger();
  });

  it('logSchemaBuild should call logger correctly', () => {
    subject.logSchemaBuild(query);

    expect(fakeLogger.debug).toHaveBeenCalledTimes(1);
    expect(fakeLogger.debug).toHaveBeenCalledWith({
      context,
      message: query,
    });
  });

  it('logMigration should call logger correctly', () => {
    subject.logMigration(query);

    expect(fakeLogger.log).toHaveBeenCalledTimes(1);
    expect(fakeLogger.log).toHaveBeenCalledWith({
      context,
      message: query,
    });
  });

  describe('logQuery', () => {
    it('should call logger correctly', () => {
      subject.logQuery(query);

      expect(fakeLogger.debug).toHaveBeenCalledTimes(1);
      expect(fakeLogger.debug).toHaveBeenCalledWith({
        context,
        message: query,
      });
    });

    it('should call logger correctly with parameters', () => {
      subject.logQuery(query, parameters);

      expect(fakeLogger.debug).toHaveBeenCalledTimes(1);
      expect(fakeLogger.debug).toHaveBeenCalledWith({
        context,
        message: formattedQueryWithParameters,
      });
    });

    it('should call logger correctly with invalid parameters', () => {
      subject.logQuery(query, invalidParams);

      expect(fakeLogger.debug).toHaveBeenCalledTimes(1);
      expect(fakeLogger.debug).toHaveBeenCalledWith({
        context,
        message: formattedQueryWithInvalidParameters,
      });
    });
  });

  describe('logQueryError', () => {
    const error = 'test failed query log errors';

    it('should call logger correctly', () => {
      subject.logQueryError(error, query);

      expect(fakeLogger.error).toHaveBeenCalledTimes(2);
      expect(fakeLogger.error).toHaveBeenCalledWith({
        context,
        message: `query failed: ${query}`,
      });
      expect(fakeLogger.error).toHaveBeenCalledWith(error);
    });

    it('should call logger correctly with parameters', () => {
      subject.logQueryError(error, query, parameters);

      expect(fakeLogger.error).toHaveBeenCalledTimes(2);
      expect(fakeLogger.error).toHaveBeenCalledWith({
        context,
        message: `query failed: ${formattedQueryWithParameters}`,
      });
      expect(fakeLogger.error).toHaveBeenCalledWith(error);
    });

    it('should call logger correctly with invalid parameters', () => {
      subject.logQueryError(error, query, invalidParams);

      expect(fakeLogger.error).toHaveBeenCalledTimes(2);
      expect(fakeLogger.error).toHaveBeenCalledWith({
        context,
        message: `query failed: ${formattedQueryWithInvalidParameters}`,
      });
      expect(fakeLogger.error).toHaveBeenCalledWith(error);
    });
  });

  describe('logQuerySlow', () => {
    const time = 1234;

    it('should call logger correctly', () => {
      subject.logQuerySlow(time, query);

      expect(fakeLogger.warn).toHaveBeenCalledTimes(1);
      expect(fakeLogger.warn).toHaveBeenCalledWith({
        context,
        message: `query is slow (execution time: ${time} ms): ${query}`,
      });
    });

    it('should call logger correctly with parameters', () => {
      subject.logQuerySlow(time, query, parameters);

      expect(fakeLogger.warn).toHaveBeenCalledTimes(1);
      expect(fakeLogger.warn).toHaveBeenCalledWith({
        context,
        message: `query is slow (execution time: ${time} ms): ${formattedQueryWithParameters}`,
      });
    });

    it('should call logger correctly with invalid parameters', () => {
      subject.logQuerySlow(time, query, invalidParams);

      expect(fakeLogger.warn).toHaveBeenCalledTimes(1);
      expect(fakeLogger.warn).toHaveBeenCalledWith({
        context,
        message: `query is slow (execution time: ${time} ms): ${formattedQueryWithInvalidParameters}`,
      });
    });
  });

  describe('log should call logger correctly', () => {
    it('when log level is LOG', () => {
      subject.log(TypeormLogLevelEnum.LOG, query);

      expect(fakeLogger.log).toHaveBeenCalledTimes(1);
      expect(fakeLogger.log).toHaveBeenCalledWith({
        context,
        message: query,
      });
    });

    it('when log level is INFO', () => {
      subject.log(TypeormLogLevelEnum.INFO, query);

      expect(fakeLogger.debug).toHaveBeenCalledTimes(1);
      expect(fakeLogger.debug).toHaveBeenCalledWith({
        context,
        message: query,
      });
    });

    it('when log level is WARN', () => {
      subject.log(TypeormLogLevelEnum.WARN, query);

      expect(fakeLogger.warn).toHaveBeenCalledTimes(1);
      expect(fakeLogger.warn).toHaveBeenCalledWith({
        context,
        message: query,
      });
    });
  });
});
