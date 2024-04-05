import { Injectable } from '@nestjs/common';
import { join } from 'path';

// TODO: importing from infrastructure/logger is causing circular dependency and tests to fail
import { LOGGER_LOG_LEVEL_MAP } from '../logger/log-levels';

import { DatabaseConfig } from './types/database-config';

import 'dotenv/config';

@Injectable()
export class ConfigService {
  public isProdEnvironment(): boolean {
    return !this.isTestEnvironment() && !this.isDevEnvironment();
  }

  public isDevEnvironment(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  public isTestEnvironment(): boolean {
    return process.env.NODE_ENV === 'test';
  }

  private getDefaultLogLevel(): string {
    return this.isTestEnvironment() ? LOGGER_LOG_LEVEL_MAP.warn.key : LOGGER_LOG_LEVEL_MAP.info.key;
  }

  public getLogLevelConfig(): string {
    const selectedLevel = process.env.LOGGER_LOG_LEVEL;

    if (!selectedLevel || !LOGGER_LOG_LEVEL_MAP[selectedLevel]) {
      return this.getDefaultLogLevel();
    }

    return LOGGER_LOG_LEVEL_MAP[selectedLevel].key;
  }

  private resolveDatabaseName(): string {
    const databaseEnvName = process.env.DATABASE_DATABASE || 'ppeedikayil_core';

    if (!this.isTestEnvironment()) {
      return databaseEnvName;
    }

    // For testing use a different database so that data can be cleared after the test is done
    return `${databaseEnvName}_test`;
  }

  public getDatabaseConfig(): DatabaseConfig {
    const host = process.env.DATABASE_HOST || 'localhost';
    const port = parseInt(process.env.DATABASE_PORT || '3306');
    const username = process.env.DATABASE_USERNAME || 'root';
    const password = process.env.DATABASE_PASSWORD || 'root';
    const database = this.resolveDatabaseName();

    return {
      type: 'mysql',
      host,
      port,
      username,
      password,
      database,
      migrationsRun: false,
      synchronize: this.isTestEnvironment(),
      migrations: [join(__dirname, '../storage/database/migration', '*.{ts,js}')],
      entities: [join(__dirname, '../storage', '**/*.entity.{ts,js}')],
      // maxQueryExecutionTime: 500,
    };
  }
}
