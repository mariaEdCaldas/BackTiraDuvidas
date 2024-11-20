import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

const isSSLRequired = process.env.DATABASE_SSL_ENABLED === 'true';

const DataSourceProd = new DataSource({
  type: process.env.DATABASE_TYPE as 'postgres' | 'mysql',
  url: process.env.DATABASE_URL,
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  extra: {
    ssl: isSSLRequired
      ? {
          rejectUnauthorized: process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
        }
      : undefined,
  },
});

export default DataSourceProd;
