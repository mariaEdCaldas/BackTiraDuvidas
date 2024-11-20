import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const DataSourceHml = new DataSource({
  type: process.env.DATABASE_TYPE as 'postgres' | 'mysql',
  url: process.env.DATABASE_URL,
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations_hml/**/*{.ts,.js}'],
});
