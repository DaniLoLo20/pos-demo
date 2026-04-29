import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/user.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "postgres",
  port: 5432,
  username: "admin",
  password: "admin",
  database: "login_db",
  synchronize: true, // SOLO DEV
  logging: true,
  entities: [User],
});