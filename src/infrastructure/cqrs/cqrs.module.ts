import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { CommandBus } from 'infrastructure/cqrs/command/command-bus';
import { CommandHandlerRegistry } from 'infrastructure/cqrs/command/command-handler-registry';
import { QueryBus } from 'infrastructure/cqrs/query/query-bus';
import { QueryHandlerRegistry } from 'infrastructure/cqrs/query/query-handler-registry';
import { LoggerModule } from 'infrastructure/logger/logger.module';
import { DatabaseStorageModule } from 'infrastructure/storage/database-storage.module';

const registries = [QueryHandlerRegistry, CommandHandlerRegistry];
const buses = [QueryBus, CommandBus];

@Module({
  imports: [LoggerModule, DiscoveryModule, DatabaseStorageModule],
  providers: [...registries, ...buses],
  exports: [...buses],
})
export class CqrsModule {}
