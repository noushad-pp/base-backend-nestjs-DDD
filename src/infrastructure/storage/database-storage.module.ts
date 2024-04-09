import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

import { ConfigModule } from 'infrastructure/config/config.module';
import { ConfigService } from 'infrastructure/config/config.service';
import { EventHandlerModule } from 'infrastructure/event-handler/event-handler.module';
import { LoggerModule } from 'infrastructure/logger/logger.module';
import { DatabaseStorageContextFactory } from 'infrastructure/storage/context/database-storage-context';
import { STORAGE_CONTEXT_FACTORY } from 'infrastructure/storage/context/storage-context.interface';
import { DatabaseLogger } from 'infrastructure/storage/database/database-logger';

const entities: EntityClassOrSchema[] = [];

const repositories: Provider[] = []; // TODO: type this properly later
const aliases = [
  {
    provide: STORAGE_CONTEXT_FACTORY,
    useExisting: DatabaseStorageContextFactory,
  },
];

const providers = [DatabaseStorageContextFactory, ...repositories, ...aliases];

@Module({
  imports: [
    LoggerModule,
    ConfigModule,
    EventHandlerModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.getDatabaseConfig(),
        logger: new DatabaseLogger(),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature(entities), // TODO find out how is this used and if it's mandatory
  ],
  providers,
  exports: providers,
})
export class DatabaseStorageModule {}
