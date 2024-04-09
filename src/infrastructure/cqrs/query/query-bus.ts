import { Injectable, Logger } from '@nestjs/common';

import { ExtractQueryResultType, Query, QueryBusInterface } from 'shared-kernel/application/query';

import { QueryHandlerRegistry } from 'infrastructure/cqrs/query/query-handler-registry';

@Injectable()
export class QueryBus implements QueryBusInterface {
  constructor(
    private readonly logger: Logger,
    private readonly queryHandlerRegistry: QueryHandlerRegistry
  ) {}

  public async execute<Q extends Query<unknown>>(query: Q): Promise<ExtractQueryResultType<Q>> {
    const queryHandler = this.queryHandlerRegistry.getQueryHandler<Q>(query.constructor.name);

    this.logger.debug(`Calling ${queryHandler.constructor.name} for ${query.constructor.name}`);

    return queryHandler.handle(query);
  }
}
