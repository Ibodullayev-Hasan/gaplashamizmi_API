import 'dotenv/config';
import { DataSource } from 'typeorm';
console.log(`DB: ${process.env.DATABASE_URL}`);

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['src/**/*.entity.ts'], 
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});

export default AppDataSource;
