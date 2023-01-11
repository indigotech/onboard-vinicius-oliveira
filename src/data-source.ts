import "reflect-metadata";
import { startApolloServer } from "./server";
import { DataSource } from "typeorm";
import { User } from "./User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "vbersano",
  password: "pharao123",
  database: "vbersano",
  synchronize: true,
  logging: false,
  entities: [User],
});

// Database Connection and start Server Setup
export const setupDBConnection = async () => {
  await AppDataSource.initialize();
  console.log("Hello from Postgres!");
};
