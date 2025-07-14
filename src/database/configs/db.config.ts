import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import * as path from 'path';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'dbconfig.dev',
  (): PostgresConnectionOptions => ({
    type: 'postgres',
    url: process.env.DATABASE_URL as string,
    entities: [path.join(__dirname, '../../**/*.entity{.ts,.js}')],
    synchronize: false,
    logging: false,
  }),
);
