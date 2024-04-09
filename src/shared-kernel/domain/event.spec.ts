import { DomainEvent } from './event';

type EventProps = Readonly<{
  id: string;
  raisedAt: Date;
  someValue: string;
}>;

class TestDomainEvent extends DomainEvent<'TestEvent', EventProps> {}

describe('Event', () => {
  let fakeDate: Date;
  let subject: TestDomainEvent;

  beforeEach(() => {
    fakeDate = new Date();
    jest.useFakeTimers().setSystemTime(fakeDate);

    subject = new TestDomainEvent({ id: '1', raisedAt: new Date(), someValue: 'value' });
  });

  it('should set data when created', () => {
    expect(subject.aggregateId).toEqual('1');
    expect(subject.raisedAt).toEqual(fakeDate);
    expect(subject._tag).toEqual('TestDomainEvent');
  });

  it('should create with proper values', () => {
    const subject2 = new TestDomainEvent({ id: '2', raisedAt: new Date(), someValue: 'value2' });

    expect(subject2.aggregateId).toEqual('2');
    expect(subject.raisedAt).toEqual(fakeDate);
    expect(subject._tag).toEqual('TestDomainEvent');

    expect(subject2).not.toEqual(subject);
  });
});
