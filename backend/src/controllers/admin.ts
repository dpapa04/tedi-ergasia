import { Request, Response } from "express";
import { AppDataSource } from "../config/data";
import { User, UserStatus } from "../entities/users";
import { Event } from "../entities/events";

const publicUser = (user: User) => {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
};

export const listUsers = async (_req: Request, res: Response) => {
  const users = await AppDataSource.getRepository(User).find({ order: { createdAt: "DESC" } });
  return res.json(users.map(publicUser));
};

const setUserStatus = (status: UserStatus) => async (req: Request, res: Response) => {
  const user = await AppDataSource.getRepository(User).findOneBy({ id: String(req.params.id) });
  if (!user) return res.status(404).json({ message: "User not found." });
  user.status = status;
  await AppDataSource.getRepository(User).save(user);
  return res.json(publicUser(user));
};

export const approveUser = setUserStatus(UserStatus.APPROVED);
export const rejectUser = setUserStatus(UserStatus.REJECTED);

export const exportEventsJSON = async (_req: Request, res: Response) => {
  const events = await AppDataSource.getRepository(Event).find({
    relations: { organizer: true, ticketTypes: true, bookings: { attendee: true, ticketType: true } }
  });
  return res.json({
    events: events.map((event) => ({
      ...event,
      organizer: event.organizer ? publicUser(event.organizer) : event.organizer,
      bookings: event.bookings?.map((booking) => ({
        ...booking,
        attendee: booking.attendee ? publicUser(booking.attendee) : booking.attendee,
      })),
    })),
  });
};