export abstract class StorageTxContextInterface {
  public abstract begin(): Promise<void>;

  public abstract commit(): Promise<void>;

  public abstract rollback(): Promise<void>;
}
