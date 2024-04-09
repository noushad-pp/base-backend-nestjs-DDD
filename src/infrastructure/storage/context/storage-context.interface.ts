import { StorageTxContextInterface } from 'shared-kernel/application/storage-context';

export interface StorageContextFactoryInterface {
  create(): Promise<StorageTxContextInterface>;
}

export const STORAGE_CONTEXT_FACTORY = Symbol('STORAGE_CONTEXT_FACTORY');
