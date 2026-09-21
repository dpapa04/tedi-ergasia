import { Router } from "express";
import { createBooking } from "../controllers/booking";
import { authenticateToken, authorizeRoles } from "../middleware/user_auth";
import { UserRole } from "../entities/users";

const router = Router();

router.post("/bookings", authenticateToken, authorizeRoles(UserRole.ATTENDEE, UserRole.ORGANIZER), createBooking);

export default router;