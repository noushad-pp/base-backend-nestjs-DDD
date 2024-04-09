import { DomainValueObject } from 'shared-kernel/domain/value-object';

import { TaggedClass } from '../types';

export type DomainEventEssentials = {
  id: DomainValueObject;
  raisedAt: Date;
};

export abstract class DomainEvent<TTag extends string, TProps extends DomainEventEssentials> extends TaggedClass<TTag> {
  public constructor(public readonly props: TProps) {
    super();
  }

  get aggregateId(): (typeof this.props)['id'] {
    return this.props.id;
  }

  get raisedAt(): (typeof this.props)['raisedAt'] {
    return this.props.raisedAt;
  }
}

export type GenericDomainEvent = DomainEvent<string, DomainEventEssentials>;
