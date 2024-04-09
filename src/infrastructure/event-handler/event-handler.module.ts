import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { EventBusInterface } from 'shared-kernel/application/event';

import { EventBus } from 'infrastructure/event-handler/event-bus';
import { EventHandlerRegistry } from 'infrastructure/event-handler/event-handler-registry';
import { LoggerModule } from 'infrastructure/logger/logger.module';

const aliases = [
  {
    provide: EventBusInterface,
    useExisting: EventBus,
  },
];

@Module({
  imports: [LoggerModule, DiscoveryModule],
  providers: [EventHandlerRegistry, EventBus, ...aliases],
  exports: [EventBus, ...aliases],
})
export class EventHandlerModule {}
