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
      query.andWhere("(event.title LIKE :q OR event.description LIKE :q)", { q: `%${q}%` });
    }

    if (location) {
      query.andWhere("(event.city LIKE :loc OR event.venue LIKE :loc)", { loc: `%${location}%` });
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

    const pageNumber = Number(page);
    const take = Number(pageSize);
    if (!Number.isInteger(pageNumber) || pageNumber < 1 || !Number.isInteger(take) || take < 1 || take > 100) {
      return res.status(400).json({ message: "Page must be a positive integer and pageSize must be between 1 and 100." });
    }
    const skip = (pageNumber - 1) * take;

    query.skip(skip).take(take);

    const [events, total] = await query.getManyAndCount();

    return res.json({
      data: events,
      pagination: {
        total,
        page: pageNumber,
        pageSize: take,
        totalPages: Math.ceil(total / take)
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Search query failed.", error });
  }
};