import { Router } from "express";
import { getRecommendations } from "../controllers/recommendation";
import { authenticateToken, authorizeRoles } from "../middleware/user_auth";
import { UserRole } from "../entities/users";

const router = Router();

router.get(
  "/recommendations",
  authenticateToken,
  authorizeRoles(UserRole.ATTENDEE, UserRole.ORGANIZER),
  getRecommendations
);

export default router;