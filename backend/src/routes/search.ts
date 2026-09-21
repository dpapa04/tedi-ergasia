import { Router } from "express";
import { searchEvents } from "../controllers/search";

const router = Router();

// Publicly accessible search endpoint (Guests, Attendees, Organizers, Admin)
router.get("/", searchEvents);

export default router;