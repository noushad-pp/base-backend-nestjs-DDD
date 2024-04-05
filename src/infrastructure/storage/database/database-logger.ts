import { LoggerService } from '@nestjs/common';
import { Logger, QueryRunner } from 'typeorm';

import { LoggerModule } from '../../logger/logger.module';

export enum TypeormLogLevelEnum {
  LOG = 'log',
  INFO = 'info',
  WARN = 'warn',
}
export class DatabaseLogger implements Logger {
  private readonly logger: LoggerService;
  public constructor() {
    this.logger = LoggerModule.createLogger();
  }

  public logQuery(query: string, parameters?: any[], _queryRunner?: QueryRunner): void {
    const queryLog = this.formatQueryWithParameters(query, parameters);
    const formattedMessage = this.formatMessage(queryLog);

    this.logger.debug!(formattedMessage);
  }

  public logQueryError(error: string, query: string, parameters?: any[], _queryRunner?: QueryRunner): void {
    const queryLog = this.formatQueryWithParameters(query, parameters);
    const formattedMessage = this.formatMessage(`query failed: ${queryLog}`);

    this.logger.error(formattedMessage);
    this.logger.error(error);
  }

  public logQuerySlow(time: number, query: string, parameters?: any[], _queryRunner?: QueryRunner): void {
    const queryLog = this.formatQueryWithParameters(query, parameters);
    const formattedMessage = this.formatMessage(`query is slow (execution time: ${time} ms): ${queryLog}`);

    this.logger.warn(formattedMessage);
  }

  public logSchemaBuild(message: string, _queryRunner?: QueryRunner): void {
    const formattedMessage = this.formatMessage(message);

    // TODO: remove the non-null assertion operator
    this.logger.debug!(formattedMessage);
  }

  public logMigration(message: string, _queryRunner?: QueryRunner): void {
    const formattedMessage = this.formatMessage(message);

    this.logger.log(formattedMessage);
  }

  public log(level: TypeormLogLevelEnum, message: any, _queryRunner?: QueryRunner): void {
    const formattedMessage = this.formatMessage(message);

    switch (level) {
      case TypeormLogLevelEnum.INFO:
        // TODO: remove the non-null assertion operator
        return this.logger.debug!(formattedMessage);
      case TypeormLogLevelEnum.LOG:
        return this.logger.log(formattedMessage);
      case TypeormLogLevelEnum.WARN:
        return this.logger.warn(formattedMessage);
    }
  }

  private formatMessage(message: string): object {
    return {
      context: 'database',
      message,
    };
  }

  private formatQueryWithParameters(query: string, parameters?: any[]): string {
    return query + this.formatParameters(parameters);
  }

  private formatParameters(parameters?: any[]): string {
    if (!parameters || !parameters.length) {
      return '';
    }

    return ` -- PARAMETERS: ${this.stringifyParams(parameters)}`;
  }

  private stringifyParams(parameters: any[]): string | any[] {
    try {
      return JSON.stringify(parameters);
    } catch (error) {
      // most probably circular objects in parameters
      return parameters;
    }
  }
}
