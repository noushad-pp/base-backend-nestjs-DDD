import { Injectable, Logger } from '@nestjs/common';

import { Event, EventBusInterface } from 'shared-kernel/application/event';
import { StorageTxContextInterface } from 'shared-kernel/application/storage-context';

import { EventHandlerRegistry } from 'infrastructure/event-handler/event-handler-registry';

@Injectable()
export class EventBus implements EventBusInterface {
  constructor(
    private readonly logger: Logger,
    private readonly eventHandlerRegistry: EventHandlerRegistry
  ) {}

  public async execute<E extends Event>(event: E, storageTxContext: StorageTxContextInterface): Promise<void> {
    const eventHandlers = this.eventHandlerRegistry.getEventHandlers<E>(event.constructor.name);

    for (const eventHandler of eventHandlers) {
      this.logger.debug(`Calling ${eventHandler.constructor.name} for ${event.constructor.name}`);

      try {
        await eventHandler.handle(event, storageTxContext);
      } catch (e) {
        this.logger.error({
          message: `Processing event handler ${eventHandler.constructor.name} for event ${event.constructor.name} failed.`,
          errorType: (e as Error).constructor.name,
          errorMessage: (e as Error).message,
          event,
        });

        throw e;
      }
    }
  }
}
