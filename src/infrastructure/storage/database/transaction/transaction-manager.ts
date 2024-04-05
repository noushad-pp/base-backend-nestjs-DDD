import { EntityManager, QueryRunner } from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';

import { QueryRunnerFactoryInterface } from './query-runner-factory.interface';

export class TransactionManager {
  private currentQueryRunner: QueryRunner | undefined;

  public constructor(private readonly factory: QueryRunnerFactoryInterface) {}

  public async begin(isolationLevel?: IsolationLevel): Promise<void> {
    this.guardAgainstMultipleTransactions();

    this.currentQueryRunner = this.factory.createQueryRunner();
    await this.currentQueryRunner.connect();
    await this.currentQueryRunner.startTransaction(isolationLevel);
  }

  public get entityManager(): EntityManager {
    this.guardAgainstInactiveTransaction();

    return this.currentQueryRunner!.manager;
  }

  public get hasActiveTransaction(): boolean {
    return this.currentQueryRunner !== undefined;
  }

  public async commit(): Promise<void> {
    this.guardAgainstInactiveTransaction();

    await this.currentQueryRunner?.commitTransaction();

    await this.release();
  }

  public async rollback(): Promise<void> {
    this.guardAgainstInactiveTransaction();

    await this.currentQueryRunner?.rollbackTransaction();

    await this.release();
  }

  public async release(): Promise<void> {
    await this.currentQueryRunner?.release();
    this.currentQueryRunner = undefined;
  }

  // TODO: tell compiler that this.currentQueryRunner is not undefined after this check
  private guardAgainstInactiveTransaction() {
    if (!this.hasActiveTransaction) {
      throw new TransactionNotActiveError();
    }
  }

  private guardAgainstMultipleTransactions() {
    if (this.hasActiveTransaction) {
      throw new TransactionAlreadyActiveError();
    }
  }
}

export class TransactionAlreadyActiveError extends Error {
  constructor() {
    super('TransactionAlreadyActive');
  }
}

export class TransactionNotActiveError extends Error {
  constructor() {
    super('TransactionNotActive');
  }
}

// TODO: add integration tests for TransactionManager
