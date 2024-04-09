import { Inject, Injectable, Logger } from '@nestjs/common';

import { Command, CommandBusInterface, ExtractCommandResultType } from 'shared-kernel/application/command';

import { CommandHandlerRegistry } from 'infrastructure/cqrs/command/command-handler-registry';
import {
  STORAGE_CONTEXT_FACTORY,
  StorageContextFactoryInterface,
} from 'infrastructure/storage/context/storage-context.interface';

@Injectable()
export class CommandBus implements CommandBusInterface {
  private readonly maxExecuteTries = 3;

  constructor(
    private readonly logger: Logger,
    private readonly commandHandlerRegistry: CommandHandlerRegistry,
    @Inject(STORAGE_CONTEXT_FACTORY)
    private readonly storageContextFactory: StorageContextFactoryInterface
  ) {}

  public async execute<C extends Command<unknown>>(command: C): Promise<ExtractCommandResultType<C>> {
    const commandHandler = this.commandHandlerRegistry.getCommandHandler<C>(command.constructor.name);

    this.logger.debug(`Calling ${commandHandler.constructor.name} for ${command.constructor.name}`);

    let executeTriesCounter = 0;

    const storageContext = await this.storageContextFactory.create();

    while (true) {
      try {
        await storageContext.begin();

        const result = await commandHandler.handle(command, storageContext);

        await storageContext.commit();

        return result;
      } catch (e) {
        await storageContext.rollback();

        this.logger.error({
          message: `Command ${command.constructor.name} failed.`,
          errorType: (e as Error).constructor.name,
          errorMessage: (e as Error).message,
          command,
        });

        executeTriesCounter++;

        if (executeTriesCounter >= this.maxExecuteTries) {
          throw e;
        }
      }
    }
  }
}
