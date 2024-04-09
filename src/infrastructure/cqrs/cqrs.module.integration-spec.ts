import { Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { Command, CommandHandlerInterface } from 'shared-kernel/application/command';
import { EventHandlerInterface } from 'shared-kernel/application/event';
import { Query, QueryHandlerInterface } from 'shared-kernel/application/query';
import { DomainEvent, DomainEventEssentials } from 'shared-kernel/domain/event';

import { CommandHandler } from 'infrastructure/cqrs/command/command-handler';
import { QueryHandler } from 'infrastructure/cqrs/query/query-handler';
import { EventHandler } from 'infrastructure/event-handler/event-handler';
import { EventHandlerRegistry } from 'infrastructure/event-handler/event-handler-registry';
import { DatabaseStorageModule } from 'infrastructure/storage/database-storage.module';

import { CommandBusHandlerNotFoundError, CommandHandlerRegistry } from './command/command-handler-registry';
import { QueryBusHandlerNotFoundError, QueryHandlerRegistry } from './query/query-handler-registry';
import { CqrsModule } from './cqrs.module';

class TestQuery1 extends Query<void> {
  test1: string;
}
class TestQuery2 extends Query<void> {
  test2: string;
}
class UnregisteredQuery extends Query<void> {}

@QueryHandler(TestQuery1)
class TestQueryHandler implements QueryHandlerInterface<TestQuery1> {
  async handle(_query: TestQuery1): Promise<void> {}
}

@QueryHandler(TestQuery2)
class TestQueryHandler2 implements QueryHandlerInterface<TestQuery2> {
  async handle(_query: TestQuery2): Promise<void> {}
}

class TestCommand1 extends Command<void> {
  test1: string;
}
class TestCommand2 extends Command<void> {
  test2: string;
}
class UnregisteredCommand extends Command<void> {}

@CommandHandler(TestCommand1)
class TestCommandHandler1 implements CommandHandlerInterface<TestCommand1> {
  async handle(_command: TestCommand1): Promise<void> {}
}

@CommandHandler(TestCommand2)
class TestCommandHandler2 implements CommandHandlerInterface<TestCommand2> {
  async handle(_command: TestCommand2): Promise<void> {}
}

type Payload = DomainEventEssentials & { test: string };

class TestEvent1 extends DomainEvent<'Test1', Payload> {}
class TestEvent2 extends DomainEvent<'Test2', Payload> {}
class UnregisteredEvent extends DomainEvent<'UnregisteredEvent', Payload> {}

@EventHandler([TestEvent1])
class TestEventHandler1 implements EventHandlerInterface<TestEvent1> {
  async handle(_event: TestEvent1): Promise<void> {}
}

@EventHandler([TestEvent1, TestEvent2])
class TestEventHandler2 implements EventHandlerInterface<TestEvent1 | TestEvent2> {
  async handle(_event: any): Promise<void> {}
}

const providers = [
  TestQueryHandler,
  TestQueryHandler2,
  TestCommandHandler1,
  TestCommandHandler2,
  TestEventHandler1,
  TestEventHandler2,
];

@Module({
  imports: [DatabaseStorageModule, CqrsModule],
  providers,
  exports: providers,
})
class TestApplicationModule {}

describe('CqrsModule (integration)', () => {
  let module: TestingModule;

  let queryHandlerRegistry: QueryHandlerRegistry;
  let commandHandlerRegistry: CommandHandlerRegistry;
  let eventHandlerRegistry: EventHandlerRegistry;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [CqrsModule, TestApplicationModule],
    }).compile();

    await module.init();

    queryHandlerRegistry = module.get<QueryHandlerRegistry>(QueryHandlerRegistry);
    commandHandlerRegistry = module.get<CommandHandlerRegistry>(CommandHandlerRegistry);
    eventHandlerRegistry = module.get<EventHandlerRegistry>(EventHandlerRegistry);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('query', () => {
    it('should return registered query handlers', () => {
      const queryHandler1 = queryHandlerRegistry.getQueryHandler(TestQuery1.name);
      const queryHandler2 = queryHandlerRegistry.getQueryHandler(TestQuery2.name);

      expect(queryHandler1).toBeInstanceOf(TestQueryHandler);
      expect(queryHandler2).toBeInstanceOf(TestQueryHandler2);
    });

    it('should throw error if handler is not registered', () => {
      expect(() => queryHandlerRegistry.getQueryHandler(UnregisteredQuery.name)).toThrow(QueryBusHandlerNotFoundError);
    });
  });

  describe('command', () => {
    it('should return registered command handlers', () => {
      const commandHandler1 = commandHandlerRegistry.getCommandHandler(TestCommand1.name);
      const commandHandler2 = commandHandlerRegistry.getCommandHandler(TestCommand2.name);

      expect(commandHandler1).toBeInstanceOf(TestCommandHandler1);
      expect(commandHandler2).toBeInstanceOf(TestCommandHandler2);
    });

    it('should throw error if handler is not registered', () => {
      expect(() => commandHandlerRegistry.getCommandHandler(UnregisteredCommand.name)).toThrow(
        CommandBusHandlerNotFoundError
      );
    });
  });

  describe('event', () => {
    it('should return registered event handlers', () => {
      const event1Handlers = eventHandlerRegistry.getEventHandlers(TestEvent1.name);
      const event2Handlers = eventHandlerRegistry.getEventHandlers(TestEvent2.name);

      expect(event1Handlers.length).toBe(2);
      expect(event1Handlers[0]).toBeInstanceOf(TestEventHandler1);
      expect(event1Handlers[1]).toBeInstanceOf(TestEventHandler2);
      expect(event2Handlers.length).toBe(1);
      expect(event2Handlers[0]).toBeInstanceOf(TestEventHandler2);
    });

    it('should return empty array if no handlers are registered', () => {
      const eventHandlers = eventHandlerRegistry.getEventHandlers(UnregisteredEvent.name);

      expect(eventHandlers.length).toBe(0);
      expect(eventHandlers).toEqual([]);
    });
  });

  // TODO: Add failing tests? It would need another appInstance to be created
});
