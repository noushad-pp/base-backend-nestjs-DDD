import { Injectable, Logger, OnModuleInit, Type } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

import { EventHandlerInterface } from 'shared-kernel/application/event';
import { GenericDomainEvent } from 'shared-kernel/domain/event';

import { EVENT_HANDLER_METADATA_KEY } from 'infrastructure/event-handler/event-handler';

type Event = GenericDomainEvent;

@Injectable()
export class EventHandlerRegistry implements OnModuleInit {
  public constructor(
    private readonly logger: Logger,
    private readonly discoveryService: DiscoveryService
  ) {}

  private readonly eventHandlerMap = new Map<string, EventHandlerInterface<Event>[]>();

  public getEventHandlers<E extends Event>(eventType: string): EventHandlerInterface<E>[] {
    return this.eventHandlerMap.get(eventType) || [];
  }

  public registerEventHandler<E extends Event>(event: Type<E>, eventHandler: EventHandlerInterface<E>): void {
    const currentHandlers = this.eventHandlerMap.get(event.name) || [];

    currentHandlers.push(eventHandler);

    this.eventHandlerMap.set(event.name, currentHandlers);
  }

  public onModuleInit(): void {
    const providers = this.discoveryService.getProviders();

    providers.forEach((provider) => {
      if (!provider.metatype) {
        return;
      }

      const events: Type<Event>[] = Reflect.getMetadata(EVENT_HANDLER_METADATA_KEY, provider.metatype);

      if (events) {
        events.forEach((event) => {
          this.registerEventHandler(event, provider.instance);
        });
      }
    });

    this.logger.debug('Event handlers registered');
  }
}
