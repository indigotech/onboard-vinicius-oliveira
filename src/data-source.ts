import "reflect-metadata";
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
  logging: true,
  entities: [User],
});

// Database Connection
export const setupDBConnection = () => {
  AppDataSource.initialize()
    .then(() => {
      console.log("Hello from Postgres!");
    })
    .catch((error) => console.log(error));
};
