import { createMock } from '@golevelup/ts-jest';
import { Logger } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

import { Query, QueryHandlerInterface } from 'shared-kernel/application/query';

import { QueryHandler } from 'infrastructure/cqrs/query/query-handler';
import {
  QueryBusHandlerNotFoundError,
  QueryBusMultipleHandlersError,
  QueryHandlerRegistry,
} from 'infrastructure/cqrs/query/query-handler-registry';

class TestQuery extends Query<string> {
  test: string;
}

@QueryHandler(TestQuery)
class TestQueryHandler implements QueryHandlerInterface<TestQuery> {
  async handle(query: TestQuery): Promise<string> {
    return query.test;
  }
}

@QueryHandler(TestQuery)
class AnotherTestQueryHandler implements QueryHandlerInterface<TestQuery> {
  async handle(query: TestQuery): Promise<string> {
    return query.test;
  }
}

describe('QueryHandlerRegistry', () => {
  let subject: QueryHandlerRegistry;

  beforeEach(async () => {
    const loggerMock = createMock<Logger>();
    const discoveryServiceMock = createMock<DiscoveryService>();

    subject = new QueryHandlerRegistry(loggerMock, discoveryServiceMock);
  });

  it('should return registered query handler', () => {
    const testQueryHandler = new TestQueryHandler();

    subject.registerQueryHandler(TestQuery, testQueryHandler);

    const registryTestQueryHandler = subject.getQueryHandler(TestQuery.name);

    expect(registryTestQueryHandler).toBe(testQueryHandler);
  });

  it('should throw error if handler is not registered', () => {
    expect(() => subject.getQueryHandler(TestQuery.name)).toThrow(QueryBusHandlerNotFoundError);
  });

  it('should not allow registering multiple handlers', async () => {
    const testQueryHandler = new TestQueryHandler();
    const testQueryHandler2 = new AnotherTestQueryHandler();

    subject.registerQueryHandler(TestQuery, testQueryHandler);

    expect(() => subject.registerQueryHandler(TestQuery, testQueryHandler2)).toThrow(QueryBusMultipleHandlersError);
  });
});
