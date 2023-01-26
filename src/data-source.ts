import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './User';

export const AppDataSource = new DataSource({
  type: 'postgres',
  synchronize: true,
  logging: false,
  entities: [User],
});

export const setupDBConnection = async () => {
  await AppDataSource.setOptions({ url: process.env.DB_URL }).initialize();
  console.info('Hello from Postgres!');
};

export const dropDb = async () => {
  await AppDataSource.dropDatabase();
};

export const cleanDB = async () => {
  await AppDataSource.query('TRUNCATE TABLE "user" CASCADE;');
  console.info(`Database Cleaned!`);
};
