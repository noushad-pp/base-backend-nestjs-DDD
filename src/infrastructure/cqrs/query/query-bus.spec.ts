import { createMock } from '@golevelup/ts-jest';
import { Logger } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

import { Query, QueryHandlerInterface } from 'shared-kernel/application/query';

import { QueryBus } from 'infrastructure/cqrs/query/query-bus';
import { QueryHandlerRegistry } from 'infrastructure/cqrs/query/query-handler-registry';

interface TestQueryPayload {
  test: string;
}
class TestQuery extends Query<void> {
  constructor(public readonly props: TestQueryPayload) {
    super();
  }
}

class TestQueryHandler implements QueryHandlerInterface<TestQuery> {
  async handle(_query: TestQuery): Promise<void> {}
}

describe('QueryBus', () => {
  let registry: QueryHandlerRegistry;
  let subject: QueryBus;

  beforeEach(async () => {
    const logger = createMock<Logger>();
    const discoveryMock = createMock<DiscoveryService>();

    registry = new QueryHandlerRegistry(logger, discoveryMock);

    subject = new QueryBus(logger, registry);
  });

  it('should execute correct query handler', async () => {
    const queryHandler = new TestQueryHandler();

    jest.spyOn(queryHandler, 'handle');

    registry.registerQueryHandler(TestQuery, queryHandler);

    const query = new TestQuery({ test: 'test' });

    await subject.execute(query);

    expect(queryHandler.handle).toHaveBeenCalledTimes(1);
    expect(queryHandler.handle).toHaveBeenCalledWith(query);
  });
});
