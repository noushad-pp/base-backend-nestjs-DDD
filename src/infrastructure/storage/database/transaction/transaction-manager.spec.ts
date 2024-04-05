import { createMock } from '@golevelup/ts-jest';
import { EntityManager } from 'typeorm';

import { QueryRunnerFactoryInterface } from './query-runner-factory.interface';
import { TransactionAlreadyActiveError, TransactionManager, TransactionNotActiveError } from './transaction-manager';

class MockQueryRunner {
  public isReleased = false;
  public isTransactionActive = false;
  public manager = createMock<EntityManager>();

  async connect(): Promise<void> {
    this.isReleased = false;
  }
  async startTransaction(): Promise<void> {
    this.isTransactionActive = true;
  }
  async rollbackTransaction(): Promise<void> {
    this.isTransactionActive = false;
  }
  async commitTransaction(): Promise<void> {
    this.isTransactionActive = false;
  }
  async release(): Promise<void> {
    this.isReleased = true;
  }
}

describe('TransactionManager', () => {
  let queryRunnerFactory: QueryRunnerFactoryInterface;
  let queryRunner: MockQueryRunner;
  let subject: TransactionManager;

  beforeEach(() => {
    queryRunner = new MockQueryRunner();
    queryRunnerFactory = createMock<QueryRunnerFactoryInterface>({
      createQueryRunner: () => queryRunner,
    });

    subject = new TransactionManager(queryRunnerFactory);
  });

  it('should start transaction on query runner', async () => {
    await subject.begin();

    expect(queryRunner.isReleased).toBeFalsy();
    expect(queryRunner.isTransactionActive).toBeTruthy();

    expect(subject.hasActiveTransaction).toBeTruthy();
  });

  it('should not allow multiple running transactions', async () => {
    await subject.begin();

    await expect(() => subject.begin()).rejects.toThrow(TransactionAlreadyActiveError);

    expect(subject.hasActiveTransaction).toBeTruthy();
  });

  it('should commit transaction on query runner and release', async () => {
    await subject.begin();
    await subject.commit();

    expect(queryRunner.isReleased).toBeTruthy();
    expect(queryRunner.isTransactionActive).toBeFalsy();

    expect(subject.hasActiveTransaction).toBeFalsy();
  });

  it('should not allow commit without an active transaction', async () => {
    await expect(() => subject.commit()).rejects.toThrow(TransactionNotActiveError);
  });

  it('should rollback transaction on query runner and release', async () => {
    await subject.begin();
    await subject.rollback();

    expect(queryRunner.isReleased).toBeTruthy();
    expect(queryRunner.isTransactionActive).toBeFalsy();

    expect(subject.hasActiveTransaction).toBeFalsy();
  });

  it('should not allow rollback without an active transaction', async () => {
    await expect(() => subject.rollback()).rejects.toThrow(TransactionNotActiveError);
  });

  it('should release query runner', async () => {
    await subject.begin();
    await subject.release();

    expect(queryRunner.isReleased).toBeTruthy();

    expect(subject.hasActiveTransaction).toBeFalsy();
  });

  it('should return manager of active transaction', async () => {
    await subject.begin();

    expect(subject.entityManager).toBe(queryRunner.manager);
  });

  it('should not allow getting entity manager without an active transaction', async () => {
    expect(() => subject.entityManager).toThrow(TransactionNotActiveError);
  });
});
