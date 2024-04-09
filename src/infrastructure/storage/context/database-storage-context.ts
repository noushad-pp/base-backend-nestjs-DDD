import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

import { EventBusInterface } from 'shared-kernel/application/event';
import { StorageTxContextInterface } from 'shared-kernel/application/storage-context';

import { TransactionManager } from 'infrastructure/storage/database/transaction/transaction-manager';

import { StorageContextFactoryInterface } from './storage-context.interface';

export class DatabaseStorageContext implements StorageTxContextInterface {
  constructor(
    private readonly transactionManager: TransactionManager,
    private readonly eventBus: EventBusInterface
  ) {}

  public async begin(): Promise<void> {
    return this.transactionManager.begin('SERIALIZABLE');
  }
  public get entityManager(): EntityManager {
    return this.transactionManager.entityManager;
  }

  public async commit(): Promise<void> {
    return this.transactionManager.commit();
  }

  public async rollback(): Promise<void> {
    return this.transactionManager.rollback();
  }

  // // TODO: add aggregate repositories here for eg:
  // public getAggregateRepository(): MyAggregateRepository {
  //   return new MyAggregateRepository(this, this.eventBus);
  // }
}

@Injectable()
export class DatabaseStorageContextFactory implements StorageContextFactoryInterface {
  constructor(
    private readonly dataSource: DataSource,
    private readonly eventBus: EventBusInterface
  ) {}

  public async create(): Promise<DatabaseStorageContext> {
    const transactionManager = new TransactionManager(this.dataSource);

    return new DatabaseStorageContext(transactionManager, this.eventBus);
  }
}
