import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import * as path from 'path';


export default (): PostgresConnectionOptions => ({

  url: process.env.DATABASE_URL as string,
  migrations:[],
  type: 'postgres',
  entities: [path.resolve(__dirname, '..') + '/**/*.entity{.ts,.js}'],
  synchronize: false
});
