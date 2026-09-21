import { Response } from "express";
import { AppDataSource } from "../config/data";
import { Message } from "../entities/messages";
import { User } from "../entities/users";
import { Event, EventStatus } from "../entities/events";
import { Booking } from "../entities/bookings";
import { AuthRequest } from "../middleware/user_auth";

const messageRepo = AppDataSource.getRepository(Message);
const eventRepo = AppDataSource.getRepository(Event);
const bookingRepo = AppDataSource.getRepository(Booking);

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { recipientId, eventId, subject, body } = req.body;
    const senderId = req.user?.userId;

    const sender = await AppDataSource.getRepository(User).findOneBy({ id: senderId });
    const recipient = await AppDataSource.getRepository(User).findOneBy({ id: recipientId });

    if (!recipient) return res.status(404).json({ message: "Recipient not found." });

    const message = messageRepo.create({ sender: sender!, recipient, subject, body });
    if (eventId) message.event = { id: eventId } as Event;

    await messageRepo.save(message);
    return res.status(201).json({ message: "Message sent successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to send message.", error });
  }
};

export const getInbox = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const messages = await messageRepo.find({
      where: { recipient: { id: userId }, deletedByRecipient: false },
      relations: ["sender", "event"],
      order: { createdAt: "DESC" }
    });
    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch inbox.", error });
  }
};

export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  try {
    const count = await messageRepo.count({
      where: { recipient: { id: req.user?.userId }, isRead: false, deletedByRecipient: false }
    });
    return res.json({ unreadCount: count });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch count.", error });
  }
};

export const cancelEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const organizerId = req.user?.userId;

    const event = await eventRepo.findOne({ where: { id }, relations: ["organizer"] });

    if (!event || event.organizer.id !== organizerId) {
      return res.status(403).json({ message: "Unauthorized to cancel this event." });
    }

    event.status = EventStatus.CANCELLED;
    await eventRepo.save(event);

    const bookings = await bookingRepo.find({
      where: { event: { id: event.id } },
      relations: ["attendee"]
    });

    const notifications = bookings.map(b =>
      messageRepo.create({
        sender: event.organizer,
        recipient: b.attendee,
        event,
        subject: `Cancelled: ${event.title}`,
        body: `We regret to inform you that "${event.title}" has been cancelled.`
      })
    );

    if (notifications.length > 0) {
      await messageRepo.save(notifications);
    }

    return res.json({ message: "Event cancelled and attendees notified." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to cancel event.", error });
  }
};