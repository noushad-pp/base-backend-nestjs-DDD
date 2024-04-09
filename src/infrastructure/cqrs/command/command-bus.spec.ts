import { createMock } from '@golevelup/ts-jest';
import { Logger } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

import { Command, CommandHandlerInterface } from 'shared-kernel/application/command';
import { StorageTxContextInterface } from 'shared-kernel/application/storage-context';

import { DatabaseStorageContext } from 'infrastructure/storage/context/database-storage-context';
import { StorageContextFactoryInterface } from 'infrastructure/storage/context/storage-context.interface';

import { CommandBus } from './command-bus';
import { CommandHandlerRegistry } from './command-handler-registry';

interface TestCommandPayload {
  testId: string;
}
class TestCommand extends Command<string> implements TestCommandPayload {
  constructor(public readonly props: TestCommandPayload) {
    super();
  }

  testId: string;
}

class FailingTestCommandHandler implements CommandHandlerInterface<TestCommand> {
  handle(_command: TestCommand): Promise<string> {
    throw new Error('test');
  }
}

class TestCommandHandler implements CommandHandlerInterface<TestCommand> {
  handle(_command: TestCommand): Promise<string> {
    return Promise.resolve('ok');
  }
}

describe('Command Bus', () => {
  let commandHandlerRegistry: CommandHandlerRegistry;
  let storageContext: StorageTxContextInterface;
  let subject: CommandBus;

  beforeEach(async () => {
    const logger = createMock<Logger>();
    const discoveryMock = createMock<DiscoveryService>();

    commandHandlerRegistry = new CommandHandlerRegistry(logger, discoveryMock);

    storageContext = createMock<DatabaseStorageContext>();

    const storageContextFactory = createMock<StorageContextFactoryInterface>({
      create: async () => storageContext,
    });

    subject = new CommandBus(logger, commandHandlerRegistry, storageContextFactory);
  });

  it('should execute registered handler and commit', async () => {
    const handler = new TestCommandHandler();

    jest.spyOn(handler, 'handle');

    commandHandlerRegistry.registerCommandHandler(TestCommand, handler);

    const command = new TestCommand({ testId: 'testId' });

    await subject.execute(command);

    expect(handler.handle).toHaveBeenCalledTimes(1);
    expect(handler.handle).toHaveBeenCalledWith(command, storageContext);

    expect(storageContext.begin).toHaveBeenCalledTimes(1);
    expect(storageContext.commit).toHaveBeenCalledTimes(1);
    expect(storageContext.rollback).not.toHaveBeenCalled();
  });

  it('should rollback and retry if handler fails', async () => {
    const handler = new FailingTestCommandHandler();

    jest.spyOn(handler, 'handle');

    commandHandlerRegistry.registerCommandHandler(TestCommand, handler);

    const command = new TestCommand({ testId: 'newTestId' });

    await expect(() => subject.execute(command)).rejects.toThrow(Error);

    expect(handler.handle).toHaveBeenCalledTimes(3);
    expect(handler.handle).toHaveBeenNthCalledWith(1, command, storageContext);
    expect(handler.handle).toHaveBeenNthCalledWith(2, command, storageContext);
    expect(handler.handle).toHaveBeenNthCalledWith(3, command, storageContext);

    expect(storageContext.begin).toHaveBeenCalledTimes(3);
    expect(storageContext.commit).not.toHaveBeenCalled();
    expect(storageContext.rollback).toHaveBeenCalledTimes(3);
  });
});
