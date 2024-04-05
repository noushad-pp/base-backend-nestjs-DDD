import { DataSource } from 'typeorm';

import { ConfigService } from '../../../config/config.service';
import { DatabaseLogger } from '../database-logger';

const configService = new ConfigService();
const databaseConfig = configService.getDatabaseConfig();

const dataSource = new DataSource({
  ...databaseConfig,
  logger: new DatabaseLogger(),
});

export default dataSource;
