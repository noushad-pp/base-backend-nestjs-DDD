import { Injectable, Logger, OnModuleInit, Type } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

import { Command, CommandHandlerInterface } from 'shared-kernel/application/command';

import { COMMAND_HANDLER_METADATA_KEY } from 'infrastructure/cqrs/command/command-handler';

@Injectable()
export class CommandHandlerRegistry implements OnModuleInit {
  public constructor(
    private readonly logger: Logger,
    private readonly discoveryService: DiscoveryService
  ) {}

  private readonly commandHandlerMap = new Map<string, CommandHandlerInterface<Command<unknown>>>();

  public getCommandHandler<C extends Command<unknown>>(commandType: string): CommandHandlerInterface<C> {
    const commandHandler = this.commandHandlerMap.get(commandType);

    if (!commandHandler) {
      throw new CommandBusHandlerNotFoundError(commandType);
    }

    return commandHandler;
  }

  public registerCommandHandler<C extends Command<unknown>>(
    command: Type<C>,
    commandHandler: CommandHandlerInterface<C>
  ): void {
    const currentHandler = this.commandHandlerMap.get(command.name);

    if (currentHandler) {
      throw new CommandBusMultipleHandlersError(command.name);
    }

    this.commandHandlerMap.set(command.name, commandHandler);
  }

  public onModuleInit(): void {
    const providers = this.discoveryService.getProviders();

    providers.forEach((provider) => {
      if (!provider.metatype) {
        return;
      }

      const commandHandler = Reflect.getMetadata(COMMAND_HANDLER_METADATA_KEY, provider.metatype);

      if (commandHandler) {
        this.registerCommandHandler(commandHandler, provider.instance);
      }
    });

    this.logger.debug('Command handlers registered');
  }
}

export class CommandBusHandlerNotFoundError extends Error {
  constructor(command: string) {
    super(`Handler for ${command} not found!`);
  }
}

export class CommandBusMultipleHandlersError extends Error {
  constructor(command: string) {
    super(`Multiple handlers registered for ${command}`);
  }
}
