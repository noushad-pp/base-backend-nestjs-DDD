import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { LoggerModule } from 'infrastructure/logger/logger.module';

import { UncaughtExceptionFilter } from './uncaught-exception-filter';

@Module({
  imports: [LoggerModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: UncaughtExceptionFilter,
    },
  ],
})
export class UncaughtExceptionModule {}
