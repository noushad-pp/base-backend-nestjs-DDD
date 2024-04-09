import { CustomDecorator, SetMetadata, Type } from '@nestjs/common';

import { Event } from 'shared-kernel/application/event';

export const EVENT_HANDLER_METADATA_KEY = Symbol('EVENT_HANDLER_METADATA_KEY');

/**
 * Decorator that marks a class as an event handler. An event handler
 * handles domain events that are raised by the aggregate root.
 *
 * The decorated class must implement the `EventHandlerInterface` which accepts
 * an instance of class that implements `DomainEvent` interface.
 *
 * @param events DomainEvent *type* to be handled by this handler.
 */
export const EventHandler = <E extends Type<Event>>(events: E[]): CustomDecorator<symbol> =>
  SetMetadata(EVENT_HANDLER_METADATA_KEY, events);
