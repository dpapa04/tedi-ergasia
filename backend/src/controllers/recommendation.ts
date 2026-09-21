import { Response } from "express";
import { AppDataSource } from "../config/data";
import { Booking } from "../entities/bookings";
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
    const eventRepo = AppDataSource.getRepository(Event);

    const allPublishedEvents = await eventRepo.find({
      where: { status: EventStatus.PUBLISHED }
    });

    const userBookings = await bookingRepo.find({
      where: { attendee: { id: userId } },
      relations: ["attendee", "event"]
    });

    const allBookings = await bookingRepo.find({
      relations: ["attendee", "event"]
    });

    const interactions = allBookings
      .filter((b) => b.attendee && b.event)
      .map((b) => ({
        userId: b.attendee.id,
        eventId: b.event.id,
        rating: 5.0
      }));

    const distinctUsers = Array.from(new Set(interactions.map((i) => i.userId)));
    const distinctEvents = Array.from(new Set(allPublishedEvents.map((e) => e.id)));

    // Train Biased Matrix Factorization model online
    const bmff = new BiasedMatrixFactorization(10, 0.005, 0.02, 15);
    bmff.train(interactions, distinctUsers, distinctEvents);

    // Score events that user hasn't booked yet
    const bookedEventIds = new Set(userBookings.map((b) => b.event.id));
    const unbookedEvents = allPublishedEvents.filter((e) => !bookedEventIds.has(e.id));

    const scored = unbookedEvents.map((event) => ({
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