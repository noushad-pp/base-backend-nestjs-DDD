import { createMock } from '@golevelup/ts-jest';
import { Logger } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

import { EventHandlerInterface } from 'shared-kernel/application/event';
import { StorageTxContextInterface } from 'shared-kernel/application/storage-context';
import { DomainEvent, DomainEventEssentials } from 'shared-kernel/domain/event';

import { EventBus } from 'infrastructure/event-handler/event-bus';
import { EventHandlerRegistry } from 'infrastructure/event-handler/event-handler-registry';

type Payload = DomainEventEssentials & { test: string };

class TestEvent extends DomainEvent<'Test', Payload> {}

class TestEventHandler1 implements EventHandlerInterface<TestEvent> {
  async handle(_event: TestEvent, _: StorageTxContextInterface): Promise<any> {}
}

class TestEventHandler2 implements EventHandlerInterface<TestEvent> {
  async handle(_event: TestEvent, _: StorageTxContextInterface): Promise<any> {}
}

describe(`${EventBus.name}`, () => {
  let fakeDate: Date;
  let registry: EventHandlerRegistry;
  let subject: EventBus;

  beforeEach(async () => {
    fakeDate = new Date();

    jest.useFakeTimers().setSystemTime(fakeDate);

    const logger = createMock<Logger>();
    const discoveryMock = createMock<DiscoveryService>();

    registry = new EventHandlerRegistry(logger, discoveryMock);

    subject = new EventBus(logger, registry);
  });

  it('should execute correct event handler', async () => {
    const eventHandler1 = new TestEventHandler1();
    const eventHandler2 = new TestEventHandler2();
    const storageTxContext = createMock<StorageTxContextInterface>();

    jest.spyOn(eventHandler1, 'handle');
    jest.spyOn(eventHandler2, 'handle');

    registry.registerEventHandler(TestEvent, eventHandler1);
    registry.registerEventHandler(TestEvent, eventHandler2);

    const event = new TestEvent({
      id: 'test-id',
      test: 'test-string',
      raisedAt: new Date(),
    });

    await subject.execute(event, storageTxContext);

    expect(eventHandler1.handle).toHaveBeenCalledTimes(1);
    expect(eventHandler1.handle).toHaveBeenCalledWith(event, storageTxContext);
    expect(eventHandler2.handle).toHaveBeenCalledTimes(1);
    expect(eventHandler2.handle).toHaveBeenCalledWith(event, storageTxContext);
  });
});
