import { Request, Response } from "express";
import { AppDataSource } from "../config/data";
import { Event, EventStatus } from "../entities/events";

export const searchEvents = async (req: Request, res: Response) => {
  try {
    const { category, q, date_from, date_to, price_min, price_max, location, page = 1, pageSize = 10 } = req.query;

    const query = AppDataSource.getRepository(Event)
      .createQueryBuilder("event")
      .leftJoinAndSelect("event.ticketTypes", "ticket")
      .where("event.status = :status", { status: EventStatus.PUBLISHED });

    if (category) {
      query.andWhere("event.categories LIKE :category", { category: `%${category}%` });
    }

    if (q) {
      query.andWhere("(event.title ILIKE :q OR event.description ILIKE :q)", { q: `%${q}%` });
    }

    if (location) {
      query.andWhere("(event.city ILIKE :loc OR event.venue ILIKE :loc)", { loc: `%${location}%` });
    }

    if (date_from) {
      query.andWhere("event.startDateTime >= :dateFrom", { dateFrom: new Date(date_from as string) });
    }

    if (date_to) {
      query.andWhere("event.endDateTime <= :dateTo", { dateTo: new Date(date_to as string) });
    }

    if (price_min) {
      query.andWhere("ticket.price >= :priceMin", { priceMin: Number(price_min) });
    }

    if (price_max) {
      query.andWhere("ticket.price <= :priceMax", { priceMax: Number(price_max) });
    }

    const take = Number(pageSize);
    const skip = (Number(page) - 1) * take;

    query.skip(skip).take(take);

    const [events, total] = await query.getManyAndCount();

    return res.json({
      data: events,
      pagination: {
        total,
        page: Number(page),
        pageSize: take,
        totalPages: Math.ceil(total / take)
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Search query failed.", error });
  }
};