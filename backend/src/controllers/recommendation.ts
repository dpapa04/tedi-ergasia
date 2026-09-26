import { Response } from "express";
import { AppDataSource } from "../config/data";
import { Booking } from "../entities/bookings";
import { EventView } from "../entities/event_views";
import { Event, EventStatus } from "../entities/events";
import { AuthRequest } from "../middleware/user_auth";
import { BiasedMatrixFactorization } from "../service/recomendations";

export const getRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const bookingRepo = AppDataSource.getRepository(Booking);
    const viewRepo = AppDataSource.getRepository(EventView);
    const eventRepo = AppDataSource.getRepository(Event);

    const allPublishedEvents = await eventRepo.find({
      where: { status: EventStatus.PUBLISHED }
    });

    const userBookings = await bookingRepo.find({
      where: { attendee: { id: userId } },
      relations: { attendee: true, event: true }
    });

    const allBookings = await bookingRepo.find({
      relations: { attendee: true, event: true }
    });

    const allViews = await viewRepo.find({
      relations: { user: true, event: true },
    });

    const interactions = allBookings
      .filter((b) => b.attendee && b.event)
      .map((b) => ({
        userId: b.attendee.id,
        eventId: b.event.id,
        rating: 5.0
      }))
      .concat(allViews.filter((view) => view.user && view.event).map((view) => ({
        userId: view.user.id,
        eventId: view.event.id,
        rating: 1.0,
      })));

    const distinctUsers = Array.from(new Set(interactions.map((i) => i.userId)));
    const distinctEvents = Array.from(new Set(allPublishedEvents.map((e) => e.id)));

    // Train Biased Matrix Factorization model online
    const bmff = new BiasedMatrixFactorization(10, 0.005, 0.02, 15);
    bmff.train(interactions, distinctUsers, distinctEvents);

    // Score events that user hasn't booked yet
    const bookedEventIds = new Set(userBookings.map((b) => b.event.id));
    const viewedEventIds = new Set(allViews.filter((view) => view.user.id === userId).map((view) => view.event.id));
    const unknownEvents = allPublishedEvents.filter((e) => !bookedEventIds.has(e.id) && !viewedEventIds.has(e.id));

    const scored = unknownEvents.map((event) => ({
      event,
      score: bmff.predict(userId!, event.id)
    }));

    scored.sort((a, b) => b.score - a.score);

    return res.json({
      recommendations: scored.slice(0, 5).map((s) => s.event),
      mode: "personalized"
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to compute recommendations.", error });
  }
};

export const recordEventView = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const eventId = String(req.params.id);
  const event = await AppDataSource.getRepository(Event).findOneBy({ id: eventId, status: EventStatus.PUBLISHED });
  if (!event) return res.status(404).json({ message: "Published event not found." });
  const user = await AppDataSource.getRepository("users").findOneBy({ id: userId });
  if (!user) return res.status(401).json({ message: "Authenticated user not found." });
  await AppDataSource.getRepository(EventView).save({ user, event });
  return res.status(201).json({ recorded: true });
};