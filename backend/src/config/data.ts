import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../entities/users";
import { Event, TicketType } from "../entities/events";
import { Booking } from "../entities/bookings";
import { Message } from "../entities/messages";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql", // or "postgres", "sqlite", etc.
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "edi_ergasia",
  synchronize: process.env.DB_SYNCHRONIZE === "true",
  logging: false,
  entities: [User, Event, TicketType, Booking, Message],
  migrations: [],
  subscribers: []
});