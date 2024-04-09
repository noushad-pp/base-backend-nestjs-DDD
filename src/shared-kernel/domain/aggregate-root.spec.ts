import { DomainEvent } from 'shared-kernel/domain/event';

import { AggregateRoot } from './aggregate-root';

type EventProps = Readonly<{
  id: string;
  raisedAt: Date;
  value: string;
}>;

class AggregateEvent1 extends DomainEvent<'AggregateEvent1', EventProps> {}
class AggregateEvent2 extends DomainEvent<'AggregateEvent2', EventProps> {}

type AggregateEvents = AggregateEvent1 | AggregateEvent2;

class AggregateRootTest extends AggregateRoot<AggregateEvents> {
  public method1(value: string) {
    this.raise(new AggregateEvent1({ id: '1', raisedAt: new Date(), value }));
  }

  public method2(value: string) {
    this.raise(new AggregateEvent2({ id: '2', raisedAt: new Date(), value }));
  }
}

describe('AggregateRoot', () => {
  let fakeDate: Date;
  let aggregate: AggregateRootTest;
  const handleEvent = jest.fn();

  beforeEach(() => {
    fakeDate = new Date();

    jest.useFakeTimers().setSystemTime(fakeDate);

    aggregate = new AggregateRootTest();
    aggregate.dispatchEvents(handleEvent);
  });

  it('Should create the instance correctly', async () => {
    let eventsList: AggregateEvents[] = [];

    expect(aggregate).toBeDefined();
    expect(aggregate.unDispatchedEvents).toEqual(eventsList);

    eventsList.push(new AggregateEvent1({ id: '1', raisedAt: fakeDate, value: 'value1' }));
    aggregate.method1('value1');
    expect(aggregate.unDispatchedEvents).toEqual(eventsList);

    eventsList.push(new AggregateEvent2({ id: '2', raisedAt: fakeDate, value: 'value2' }));
    aggregate.method2('value2');

    expect(aggregate.unDispatchedEvents).toEqual(eventsList);

    await aggregate.dispatchEvents(handleEvent);
    expect(handleEvent).toHaveBeenCalledWith(eventsList[0]);
    expect(handleEvent).toHaveBeenCalledWith(eventsList[1]);
    expect(aggregate.unDispatchedEvents).toEqual([]);

    eventsList = [new AggregateEvent1({ id: '1', raisedAt: fakeDate, value: 'value1' })];
    aggregate.method1('value1');
    expect(aggregate.unDispatchedEvents).toEqual(eventsList);
  });
});
