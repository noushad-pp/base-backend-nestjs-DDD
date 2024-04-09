import { StorageTxContextInterface } from 'shared-kernel/application/storage-context';

export abstract class Command<TResult> {
  /**
   * @internal This property is used only for type inference and should not be used in the code.
   */
  private __phantomType: TResult;
}

export type ExtractCommandResultType<TCommand> = TCommand extends Command<infer TResult> ? TResult : never;

export interface CommandHandlerInterface<TCommand extends Command<unknown>> {
  handle(command: TCommand, storageTxContext: StorageTxContextInterface): Promise<ExtractCommandResultType<TCommand>>;
}

export interface CommandBusInterface {
  execute<TCommand extends Command<unknown>>(command: TCommand): Promise<ExtractCommandResultType<TCommand>>;
}
