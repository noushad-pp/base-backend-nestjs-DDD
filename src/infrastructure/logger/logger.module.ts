import { Logger, LoggerService, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';

import { getLoggerOptions } from './logger-options';

const providers = [Logger];

@Module({
  imports: [WinstonModule.forRoot(getLoggerOptions())],
  providers,
  exports: providers,
})
export class LoggerModule {
  public static createLogger(): LoggerService {
    return WinstonModule.createLogger(getLoggerOptions());
  }
}
