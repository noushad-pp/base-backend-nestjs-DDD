import { CustomDecorator, SetMetadata, Type } from '@nestjs/common';

import { Command } from 'shared-kernel/application/command';

export const COMMAND_HANDLER_METADATA_KEY = Symbol('COMMAND_HANDLER_METADATA_KEY');

/**
 * Decorator that marks a class as a Nest command handler. A command handler
 * handles commands (actions) executed by your application code.
 *
 * The decorated class must implement the `CommandHandlerInterface` which accepts
 * an instance of class that implements `Command` interface.
 *
 * @param command command *type* to be handled by this handler.
 */
export const CommandHandler = (command: Type<Command<unknown>>): CustomDecorator<symbol> =>
  SetMetadata(COMMAND_HANDLER_METADATA_KEY, command);
