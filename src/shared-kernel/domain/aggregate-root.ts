import { DomainEvent } from './event';

type ExtractTag<T> = T extends DomainEvent<infer U, any> ? U : never;
type ExtractProps<T> = T extends DomainEvent<any, infer U> ? U : never;

export abstract class AggregateRoot<
  TDomainEvent extends DomainEvent<ExtractTag<TDomainEvent>, ExtractProps<TDomainEvent>>,
> {
  private events: TDomainEvent[] = [];

  protected raise(event: TDomainEvent): void {
    this.events.push(event);
  }

  get unDispatchedEvents(): TDomainEvent[] {
    return this.events;
  }

  public async dispatchEvents(handleEvent: (event: TDomainEvent) => Promise<void>): Promise<void> {
    for (const event of this.events) {
      await handleEvent(event);
    }
    this.clearEvents();
  }

  private clearEvents(): void {
    this.events = [];
  }
}
