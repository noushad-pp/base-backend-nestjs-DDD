import { StorageTxContextInterface } from 'shared-kernel/application/storage-context';
import { DomainEvent, DomainEventEssentials } from 'shared-kernel/domain/event';

export type Event<
  Tag extends string = string,
  Props extends DomainEventEssentials = DomainEventEssentials,
> = DomainEvent<Tag, Props>;

export abstract class EventHandlerInterface<E extends Event> {
  public abstract handle(event: E, storageTxContext: StorageTxContextInterface): Promise<void>;
}

export abstract class EventBusInterface {
  public abstract execute<E extends Event>(event: E, storageTxContext: StorageTxContextInterface): Promise<void>;
}
