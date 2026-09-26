import { Router } from "express";
import { 
  sendMessage, 
  getInbox, 
  getSent,
  getUnreadCount, 
  cancelEvent,
  markMessageRead,
  deleteMessage
} from "../controllers/messages";
import { authenticateToken, authorizeRoles } from "../middleware/user_auth";
import { UserRole } from "../entities/users";

const router = Router();

// Protected routes for all logged-in users
router.post("/", authenticateToken, sendMessage);
router.get("/inbox", authenticateToken, getInbox);
router.get("/sent", authenticateToken, getSent);
router.get("/unread-count", authenticateToken, getUnreadCount);
router.patch("/:id/read", authenticateToken, markMessageRead);
router.delete("/:id", authenticateToken, deleteMessage);

// Organizer-only route: Cancel an event and auto-notify all booked attendees
router.patch("/events/:id/cancel", authenticateToken, authorizeRoles(UserRole.ORGANIZER), cancelEvent);

export default router;