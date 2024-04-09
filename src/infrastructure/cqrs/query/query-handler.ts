import { CustomDecorator, SetMetadata, Type } from '@nestjs/common';

import { Query } from 'shared-kernel/application/query';

export const QUERY_HANDLER_METADATA_KEY = Symbol('QUERY_HANDLER_METADATA_KEY');

/**
 * Decorator that marks a class as a Nest query handler. A query handler
 * handles queries executed by your application code.
 *
 * The decorated class must implement the `QueryHandlerInterface` which accepts
 * an instance of class that implements `Query` interface.
 *
 * @param query query *type* to be handled by this handler.
 *
 * @see https://docs.nestjs.com/recipes/cqrs#queries
 */
export const QueryHandler = (query: Query<unknown> | Type<Query<unknown>>): CustomDecorator<symbol> =>
  SetMetadata(QUERY_HANDLER_METADATA_KEY, query);
