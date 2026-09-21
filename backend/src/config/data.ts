import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/users";
import { Event, TicketType } from "../entities/events";

export const AppDataSource = new DataSource({
  type: "mysql", // or "postgres", "sqlite", etc.
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "edi_ergasia",
  synchronize: true,
  logging: false,
  entities: [User, Event, TicketType],
  migrations: [],
  subscribers: []
});