import { Router } from "express";
import { createEvent, deleteEvent, getEvent, publishEvent } from "../controllers/events";
import { authenticateToken, authorizeRoles } from "../middleware/user_auth";
import { UserRole } from "../entities/users";

const router = Router();
router.get("/:id", getEvent);
router.post("/", authenticateToken, authorizeRoles(UserRole.ORGANIZER), createEvent);
router.patch("/:id/publish", authenticateToken, authorizeRoles(UserRole.ORGANIZER), publishEvent);
router.delete("/:id", authenticateToken, authorizeRoles(UserRole.ORGANIZER), deleteEvent);
export default router;