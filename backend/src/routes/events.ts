import { Router } from "express";
import { createEvent, deleteEvent, getEvent, getOrganizerEvents, publishEvent, updateEvent } from "../controllers/events";
import { authenticateToken, authorizeRoles } from "../middleware/user_auth";
import { UserRole } from "../entities/users";
import { recordEventView } from "../controllers/recommendation";

const router = Router();
router.get("/mine", authenticateToken, authorizeRoles(UserRole.ORGANIZER), getOrganizerEvents);
router.get("/:id", getEvent);
router.post("/:id/view", authenticateToken, authorizeRoles(UserRole.ATTENDEE, UserRole.ORGANIZER), recordEventView);
router.post("/", authenticateToken, authorizeRoles(UserRole.ORGANIZER), createEvent);
router.patch("/:id", authenticateToken, authorizeRoles(UserRole.ORGANIZER), updateEvent);
router.patch("/:id/publish", authenticateToken, authorizeRoles(UserRole.ORGANIZER), publishEvent);
router.delete("/:id", authenticateToken, authorizeRoles(UserRole.ORGANIZER), deleteEvent);
export default router;