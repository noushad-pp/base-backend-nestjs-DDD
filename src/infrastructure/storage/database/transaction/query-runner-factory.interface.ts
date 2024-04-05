import { QueryRunner } from 'typeorm';
import { ReplicationMode } from 'typeorm/driver/types/ReplicationMode';

export interface QueryRunnerFactoryInterface {
  createQueryRunner(mode?: ReplicationMode): QueryRunner;
}
