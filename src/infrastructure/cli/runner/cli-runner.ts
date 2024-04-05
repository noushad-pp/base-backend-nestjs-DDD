import { DynamicModule, INestApplication, LoggerService, Type } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { LOGGER_LOG_LEVEL_MAP, type LoggerLogLevel } from '../../logger/log-levels';
import { LoggerModule } from '../../logger/logger.module';
import { CliModule } from '../cli.module';

export type CliRunnerCallback = (app: INestApplication) => Promise<void>;

export interface CliRunnerOptions {
  modules: Type[];
  name?: string;
  skipApplicationInit?: boolean;
  callback?: CliRunnerCallback;
  preInitCallback?: CliRunnerCallback;
}

export class CliRunner {
  private readonly logger: LoggerService;
  private readonly contextModule: DynamicModule;

  private application: INestApplication;

  public constructor(private readonly options: CliRunnerOptions) {
    this.logger = LoggerModule.createLogger();
    this.contextModule = CliModule.register(this.options.modules);
  }

  public async startApplication(): Promise<void> {
    try {
      await this.createApplication();
      if (this.options.callback) {
        this.log('Running callback');
        await this.options.callback(this.application);
        this.log('Callback done');
      }
    } catch (e) {
      await this.handleError(e as Error);
    }
  }

  public async runOnce(): Promise<void> {
    await this.startApplication();
    await this.close();
  }

  private async createApplication(): Promise<void> {
    this.application = await NestFactory.create(this.contextModule, {
      bufferLogs: true,
    });
    this.application.useLogger(this.logger);
    this.application.enableShutdownHooks();

    if (!this.options.skipApplicationInit) {
      if (this.options.preInitCallback) {
        await this.options.preInitCallback(this.application);
      }
      await this.application.init();
    }
    this.log('Application created');
  }

  private log(message: string, level?: LoggerLogLevel): void {
    const logMessage = { context: this.options.name || 'cli.runner', message };

    if (level === LOGGER_LOG_LEVEL_MAP.error.key) {
      return this.logger.error(logMessage);
    }

    return this.logger.log(logMessage);
  }

  private async handleError(e: Error): Promise<void> {
    this.log('Application has thrown an error', LOGGER_LOG_LEVEL_MAP.error.key);
    this.logger.error(e);
    await this.close();
    process.exit(1);
  }

  private async close(): Promise<void> {
    if (this.application) {
      await this.application.close();
    }
    this.log('Closed application');
  }
}
