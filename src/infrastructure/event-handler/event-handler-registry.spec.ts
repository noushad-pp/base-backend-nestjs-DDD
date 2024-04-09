import { createMock } from '@golevelup/ts-jest';
import { Logger } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

import { EventHandlerInterface } from 'shared-kernel/application/event';
import { DomainEvent, DomainEventEssentials } from 'shared-kernel/domain/event';

import { EventHandler } from 'infrastructure/event-handler/event-handler';
import { EventHandlerRegistry } from 'infrastructure/event-handler/event-handler-registry';

type Payload = DomainEventEssentials & { test: string };

class TestEvent1 extends DomainEvent<'TestEvent1', Payload> {}
class TestEvent2 extends DomainEvent<'TestEvent2', Payload> {}
class UnregisteredTestEvent extends DomainEvent<'UnregisteredTestEvent', Payload> {}

@EventHandler([TestEvent1])
class TestEventHandler implements EventHandlerInterface<TestEvent1> {
  async handle(_event: TestEvent1): Promise<void> {}
}

@EventHandler([TestEvent1, TestEvent2])
class AnotherTestEventHandler implements EventHandlerInterface<TestEvent1 | TestEvent2> {
  async handle(_event: TestEvent1 | TestEvent2): Promise<void> {}
}

describe(`${EventHandlerRegistry.name}`, () => {
  let subject: EventHandlerRegistry;

  beforeEach(async () => {
    const loggerMock = createMock<Logger>();
    const discoveryServiceMock = createMock<DiscoveryService>();

    subject = new EventHandlerRegistry(loggerMock, discoveryServiceMock);
  });

  it('should get registered event handlers', () => {
    const testEventHandler = new TestEventHandler();
    const testEventHandler2 = new AnotherTestEventHandler();

    subject.registerEventHandler(TestEvent1, testEventHandler);
    subject.registerEventHandler(TestEvent1, testEventHandler2);
    subject.registerEventHandler(TestEvent2, testEventHandler2);

    const unregisteredTestEventHandlers = subject.getEventHandlers(UnregisteredTestEvent.name);

    expect(unregisteredTestEventHandlers.length).toBe(0);

    const testEvent1Handlers = subject.getEventHandlers(TestEvent1.name);

    expect(testEvent1Handlers).toEqual([testEventHandler, testEventHandler2]);

    const testEvent2Handlers = subject.getEventHandlers(TestEvent2.name);

    expect(testEvent2Handlers).toEqual([testEventHandler2]);
  });
});
