import { DynamicModule, Module, Type } from '@nestjs/common';

import { LoggerModule } from '../logger/logger.module';

@Module({})
export class CliModule {
  static register(importModules: Type[]): DynamicModule {
    return {
      module: CliModule,
      imports: [LoggerModule, ...importModules],
    };
  }
}
