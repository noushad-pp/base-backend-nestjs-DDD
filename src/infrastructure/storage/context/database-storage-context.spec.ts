import { createMock } from '@golevelup/ts-jest';
import { DataSource, EntityManager } from 'typeorm';

import { EventBusInterface } from 'shared-kernel/application/event';

import { TransactionManager } from 'infrastructure/storage/database/transaction/transaction-manager';

import { DatabaseStorageContext, DatabaseStorageContextFactory } from './database-storage-context';

describe('DatabaseStorageContext', () => {
  let entityManager: EntityManager;
  let transactionManager: TransactionManager;
  let subject: DatabaseStorageContext;
  let eventBus: EventBusInterface;

  beforeEach(() => {
    entityManager = createMock<EntityManager>();
    transactionManager = createMock<TransactionManager>({
      entityManager,
    });
    eventBus = createMock<EventBusInterface>();

    subject = new DatabaseStorageContext(transactionManager, eventBus);
  });

  it('begin should start the transaction', async () => {
    await subject.begin();

    expect(transactionManager.begin).toHaveBeenCalledTimes(1);
  });

  it('commit should commit the transaction', async () => {
    await subject.commit();

    expect(transactionManager.commit).toHaveBeenCalledTimes(1);
  });

  it('rollback should rollback the transaction', async () => {
    await subject.rollback();

    expect(transactionManager.rollback).toHaveBeenCalledTimes(1);
  });

  it('should return correct entity manager', async () => {
    expect(subject.entityManager).toBe(entityManager);
  });
});

describe('DatabaseStorageContextFactory', () => {
  let dataSource: DataSource;
  let subject: DatabaseStorageContextFactory;
  let eventBus: EventBusInterface;

  beforeEach(() => {
    dataSource = createMock<DataSource>();
    eventBus = createMock<EventBusInterface>();

    subject = new DatabaseStorageContextFactory(dataSource, eventBus);
  });

  it('should create new context', async () => {
    const context = await subject.create();

    expect(context).toBeInstanceOf(DatabaseStorageContext);
  });
});
