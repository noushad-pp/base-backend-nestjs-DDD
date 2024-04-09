import { createMock } from '@golevelup/ts-jest';
import { Logger } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

import { Command, CommandHandlerInterface } from 'shared-kernel/application/command';

import { CommandHandler } from 'infrastructure/cqrs/command/command-handler';
import {
  CommandBusHandlerNotFoundError,
  CommandBusMultipleHandlersError,
  CommandHandlerRegistry,
} from 'infrastructure/cqrs/command/command-handler-registry';

interface TestPayload {
  test: string;
}

class TestCommand extends Command<string> implements TestPayload {
  constructor(public readonly test: string) {
    super();
  }
}

@CommandHandler(TestCommand)
class TestCommandHandler implements CommandHandlerInterface<TestCommand> {
  async handle(_command: TestCommand): Promise<string> {
    return 'test';
  }
}

@CommandHandler(TestCommand)
class AnotherTestCommandHandler implements CommandHandlerInterface<TestCommand> {
  async handle(_command: TestCommand): Promise<string> {
    return 'another-test';
  }
}

describe('CommandHandlerRegistry', () => {
  let subject: CommandHandlerRegistry;

  beforeEach(async () => {
    const loggerMock = createMock<Logger>();
    const discoveryServiceMock = createMock<DiscoveryService>();

    subject = new CommandHandlerRegistry(loggerMock, discoveryServiceMock);
  });

  it('should return registered command handler', () => {
    const testCommandHandler = new TestCommandHandler();

    subject.registerCommandHandler(TestCommand, testCommandHandler);

    const registryTestCommandHandler = subject.getCommandHandler(TestCommand.name);

    expect(registryTestCommandHandler).toBe(testCommandHandler);
  });

  it('should throw error if handler is not registered', () => {
    expect(() => subject.getCommandHandler(TestCommand.name)).toThrow(CommandBusHandlerNotFoundError);
  });

  it('should not allow registering multiple handlers', async () => {
    const testCommandHandler = new TestCommandHandler();
    const testCommandHandler2 = new AnotherTestCommandHandler();

    subject.registerCommandHandler(TestCommand, testCommandHandler);

    expect(() => subject.registerCommandHandler(TestCommand, testCommandHandler2)).toThrow(
      CommandBusMultipleHandlersError
    );
  });
});
