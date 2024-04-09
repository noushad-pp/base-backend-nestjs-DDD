import { Injectable, Logger, OnModuleInit, Type } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

import { Query, QueryHandlerInterface } from 'shared-kernel/application/query';

import { QUERY_HANDLER_METADATA_KEY } from 'infrastructure/cqrs/query/query-handler';

@Injectable()
export class QueryHandlerRegistry implements OnModuleInit {
  public constructor(
    private readonly logger: Logger,
    private readonly discoveryService: DiscoveryService
  ) {}

  private readonly queryHandlerMap = new Map<string, QueryHandlerInterface<Query<unknown>>>();

  public getQueryHandler<Q extends Query<unknown>>(queryType: string): QueryHandlerInterface<Q> {
    const queryHandler = this.queryHandlerMap.get(queryType);

    if (!queryHandler) {
      throw new QueryBusHandlerNotFoundError(queryType);
    }

    return queryHandler;
  }

  public registerQueryHandler<Q extends Query<unknown>>(query: Type<Q>, queryHandler: QueryHandlerInterface<Q>): void {
    const currentHandler = this.queryHandlerMap.get(query.name);

    if (currentHandler) {
      throw new QueryBusMultipleHandlersError(query.name);
    }

    this.queryHandlerMap.set(query.name, queryHandler);
  }

  public onModuleInit(): void {
    const providers = this.discoveryService.getProviders();

    providers.forEach((provider) => {
      if (!provider.metatype) {
        return;
      }

      const query = Reflect.getMetadata(QUERY_HANDLER_METADATA_KEY, provider.metatype);

      if (query) {
        this.registerQueryHandler(query, provider.instance);
      }
    });

    this.logger.debug('Query handlers registered');
  }
}

export class QueryBusHandlerNotFoundError extends Error {
  constructor(query: string) {
    super(`Handler for ${query} not found!`);
  }
}

export class QueryBusMultipleHandlersError extends Error {
  constructor(query: string) {
    super(`Multiple handlers registered for ${query}`);
  }
}
