import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Message } from "./entities/Message";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: true,
  logging: false,
  entities: [User, Message],
  migrations: [],
  subscribers: [],
});
