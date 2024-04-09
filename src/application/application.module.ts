import { Module, Provider } from '@nestjs/common';

import { CqrsModule } from 'infrastructure/cqrs/cqrs.module';
import { EventHandlerModule } from 'infrastructure/event-handler/event-handler.module';
import { DatabaseStorageModule } from 'infrastructure/storage/database-storage.module';

import { AppService } from './app/app.service';

const providers: Provider[] = [
  /* query handlers */
  /* command handlers */
  /* event handlers */
  /* Services */ //TODO: Remove services
  AppService,
];

@Module({
  imports: [DatabaseStorageModule, CqrsModule, EventHandlerModule],
  providers,
})
export class ApplicationModule {}
