import { Response } from "express";
import { AppDataSource } from "../config/data";
import { Event, EventStatus, TicketType } from "../entities/events";
import { Booking } from "../entities/bookings";
import { User, UserRole } from "../entities/users";
import { AuthRequest } from "../middleware/user_auth";

const validTickets = (tickets: Array<{ name: string; price: number; quantity: number }>, capacity: number) =>
  tickets.length > 0 && tickets.every((ticket) => ticket.name && ticket.price >= 0 && ticket.quantity > 0) &&
  tickets.reduce((sum, ticket) => sum + ticket.quantity, 0) <= capacity;

export const getEvent = async (req: AuthRequest, res: Response) => {
  const event = await AppDataSource.getRepository(Event).findOne({
    where: { id: String(req.params.id) },
    relations: { organizer: true, ticketTypes: true, bookings: { attendee: true, ticketType: true } },
  });
  if (!event) return res.status(404).json({ message: "Event not found." });
  return res.json(event);
};

export const getOrganizerEvents = async (req: AuthRequest, res: Response) => {
  const events = await AppDataSource.getRepository(Event).find({
    where: { organizer: { id: req.user?.userId } },
    relations: { organizer: true, ticketTypes: true, bookings: true },
    order: { startDateTime: "ASC" },
  });
  return res.json(events);
};

export const createEvent = async (req: AuthRequest, res: Response) => {
  const { title, categories, eventType, venue, address, city, country, latitude, longitude,
    startDateTime, endDateTime, capacity, tickets, description, photos, status = EventStatus.DRAFT } = req.body;
  const numericCapacity = Number(capacity);
  if (!title || !Array.isArray(categories) || categories.length === 0 || !validTickets(tickets, numericCapacity)) {
    return res.status(400).json({ message: "Invalid event or ticket data." });
  }
  const organizer = await AppDataSource.getRepository(User).findOneBy({ id: req.user?.userId, role: UserRole.ORGANIZER });
  if (!organizer) return res.status(403).json({ message: "Only organizers can create events." });
  const event = AppDataSource.getRepository(Event).create({
    title, categories, eventType, venue, address, city, country, latitude, longitude,
    startDateTime: new Date(startDateTime), endDateTime: new Date(endDateTime), capacity: numericCapacity,
    description, photos, status, organizer,
    ticketTypes: tickets.map((ticket: { name: string; price: number; quantity: number }) => ({
      name: ticket.name, price: Number(ticket.price), quantity: ticket.quantity, available: ticket.quantity
    })) as TicketType[]
  });
  return res.status(201).json(await AppDataSource.getRepository(Event).save(event));
};

export const updateEvent = async (req: AuthRequest, res: Response) => {
  const repo = AppDataSource.getRepository(Event);
  const event = await repo.findOne({
    where: { id: String(req.params.id) },
    relations: { organizer: true, ticketTypes: true, bookings: true },
  });
  if (!event || event.organizer.id !== req.user?.userId) return res.status(404).json({ message: "Event not found." });

  const { title, categories, eventType, venue, address, city, country, latitude, longitude,
    startDateTime, endDateTime, capacity, tickets, description, photos } = req.body;
  const nextCapacity = Number(capacity);
  if (!title || !Array.isArray(categories) || categories.length === 0 || !validTickets(tickets, nextCapacity)) {
    return res.status(400).json({ message: "Invalid event or ticket data." });
  }

  const bookedTickets = event.ticketTypes.reduce((sum, ticket) => sum + ticket.quantity - ticket.available, 0);
  const nextAllocated = tickets.reduce((sum: number, ticket: { quantity: number }) => sum + Number(ticket.quantity), 0);
  if (nextCapacity < bookedTickets || nextAllocated < bookedTickets) {
    return res.status(400).json({ message: "Capacity or ticket allocation cannot be lower than existing bookings." });
  }
  if (event.bookings.length > 0 && tickets.length !== event.ticketTypes.length) {
    return res.status(400).json({ message: "Ticket types cannot be added or removed after bookings exist." });
  }

  Object.assign(event, {
    title, categories, eventType, venue, address, city, country, latitude, longitude,
    startDateTime: new Date(startDateTime), endDateTime: new Date(endDateTime), capacity: nextCapacity,
    description, photos,
  });
  if (event.bookings.length === 0) {
    event.ticketTypes = tickets.map((ticket: { name: string; price: number; quantity: number }) => ({
      name: ticket.name, price: Number(ticket.price), quantity: Number(ticket.quantity), available: Number(ticket.quantity),
    })) as TicketType[];
  } else {
    event.ticketTypes.forEach((existing, index) => {
      const next = tickets[index];
      const sold = existing.quantity - existing.available;
      existing.name = next.name;
      existing.price = Number(next.price);
      existing.quantity = Number(next.quantity);
      existing.available = Number(next.quantity) - sold;
    });
  }
  return res.json(await repo.save(event));
};

export const publishEvent = async (req: AuthRequest, res: Response) => {
  const repo = AppDataSource.getRepository(Event);
  const event = await repo.findOne({ where: { id: String(req.params.id) }, relations: { organizer: true, ticketTypes: true } });
  if (!event || event.organizer.id !== req.user?.userId) return res.status(404).json({ message: "Event not found." });
  if (event.ticketTypes.reduce((sum, ticket) => sum + ticket.quantity, 0) > event.capacity) {
    return res.status(400).json({ message: "Ticket allocation exceeds event capacity." });
  }
  event.status = EventStatus.PUBLISHED;
  return res.json(await repo.save(event));
};

export const deleteEvent = async (req: AuthRequest, res: Response) => {
  const repo = AppDataSource.getRepository(Event);
  const event = await repo.findOne({ where: { id: String(req.params.id) }, relations: { organizer: true, bookings: true } });
  if (!event || event.organizer.id !== req.user?.userId) return res.status(404).json({ message: "Event not found." });
  if (event.status !== EventStatus.DRAFT || event.bookings.length > 0) {
    return res.status(400).json({ message: "Only draft events without bookings can be deleted." });
  }
  await repo.remove(event);
  return res.status(204).send();
};