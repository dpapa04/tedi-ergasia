import { Response } from "express";
import { AppDataSource } from "../config/data";
import { Event, EventStatus, TicketType } from "../entities/events";
import { Booking, BookingStatus } from "../entities/bookings";
import { User } from "../entities/users";
import { AuthRequest } from "../middleware/user_auth";

export const createBooking = async (req: AuthRequest, res: Response) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const { eventId, ticketTypeId, numberOfTickets } = req.body;
    const userId = req.user?.userId;

    if (!numberOfTickets || numberOfTickets <= 0) {
      return res.status(400).json({ message: "Invalid ticket quantity." });
    }

    // Lock ticket and event row for concurrency safety
    const ticket = await queryRunner.manager.findOne(TicketType, {
      where: { id: ticketTypeId },
      relations: { event: true },
      lock: { mode: "pessimistic_write" }
    });

    if (!ticket || ticket.event.id !== eventId) {
      await queryRunner.rollbackTransaction();
      return res.status(404).json({ message: "Ticket type or event not found." });
    }

    if (ticket.event.status !== EventStatus.PUBLISHED) {
      await queryRunner.rollbackTransaction();
      return res.status(400).json({ message: "Event is not active for bookings." });
    }

    const event = await queryRunner.manager.findOne(Event, {
      where: { id: eventId },
      relations: { ticketTypes: true },
      lock: { mode: "pessimistic_write" }
    });
    if (!event) {
      await queryRunner.rollbackTransaction();
      return res.status(404).json({ message: "Event not found." });
    }

    const bookedTickets = event.ticketTypes.reduce(
      (total, currentTicket) => total + currentTicket.quantity - currentTicket.available,
      0
    );
    if (bookedTickets + numberOfTickets > event.capacity) {
      await queryRunner.rollbackTransaction();
      return res.status(400).json({ message: "Event capacity would be exceeded." });
    }

    // Check availability against capacity & ticket limit
    if (ticket.available < numberOfTickets) {
      await queryRunner.rollbackTransaction();
      return res.status(400).json({ message: "Not enough available tickets." });
    }

    // Deduct available tickets
    ticket.available -= numberOfTickets;
    await queryRunner.manager.save(ticket);

    const attendee = await queryRunner.manager.findOneBy(User, { id: userId });
    if (!attendee) {
      await queryRunner.rollbackTransaction();
      return res.status(401).json({ message: "Authenticated user not found." });
    }
    const totalCost = Number(ticket.price) * numberOfTickets;

    const booking = queryRunner.manager.create(Booking, {
      attendee: attendee!,
      event: ticket.event,
      ticketType: ticket,
      numberOfTickets,
      totalCost,
      bookingStatus: BookingStatus.CONFIRMED
    });

    await queryRunner.manager.save(booking);
    await queryRunner.commitTransaction();

    return res.status(201).json({
      message: "Booking confirmed successfully.",
      bookingId: booking.id,
      ref: booking.id,
      totalCost,
      createdAt: booking.createdAt,
    });
  } catch (error) {
    await queryRunner.rollbackTransaction();
    return res.status(500).json({ message: "Booking failed due to server error.", error });
  } finally {
    await queryRunner.release();
  }
};