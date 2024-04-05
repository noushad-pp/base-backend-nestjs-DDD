import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

interface DatabaseInstanceConfigDto {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface DatabaseConfig extends MysqlConnectionOptions {}
