import { Address } from './entities/Address';
import { User } from './entities/User';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  synchronize: true,
  logging: false,
  entities: [User, Address],
});

export const setupDBConnection = async () => {
  await AppDataSource.setOptions({ url: process.env.DB_URL }).initialize();
  console.info('Hello from Postgres!');
};

export const cleanDB = async () => {
  await AppDataSource.query('TRUNCATE TABLE "user" CASCADE;');
  console.info(`Database Cleaned!`);
};
