import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "vbersano",
  password: "pharao123",
  database: "vbersano",
  synchronize: true,
  logging: true,
});
