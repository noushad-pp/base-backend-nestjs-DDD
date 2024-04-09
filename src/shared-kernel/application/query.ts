export abstract class Query<TResult> {
  /**
   * @internal This property is used only for type inference and should not be used in the code.
   */
  private __phantomType: TResult;
}

export type ExtractQueryResultType<TQuery> = TQuery extends Query<infer TResult> ? TResult : never;

export interface QueryHandlerInterface<TQuery extends Query<unknown>> {
  handle(query: TQuery): Promise<ExtractQueryResultType<TQuery>>;
}

export interface QueryBusInterface {
  execute<TQuery extends Query<unknown>>(query: TQuery): Promise<ExtractQueryResultType<TQuery>>;
}
