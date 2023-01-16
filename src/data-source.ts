import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './User';

console.log(process.env.DB_URL);

export const AppDataSource = new DataSource({
  type: 'postgres',
  synchronize: true,
  logging: false,
  entities: [User],
});

// Database Connection and start Server Setup
export const setupDBConnection = async () => {
  await AppDataSource.setOptions({ url: process.env.DB_URL }).initialize();
  console.info('Hello from Postgres!');
};
