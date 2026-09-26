import { Router } from "express";
import { exportEventsXML } from "../controllers/export";
import { approveUser, exportEventsJSON, listUsers, rejectUser } from "../controllers/admin";
import { authenticateToken, authorizeRoles } from "../middleware/user_auth";
import { UserRole } from "../entities/users";

const router = Router();

router.get("/users", authenticateToken, authorizeRoles(UserRole.ADMIN), listUsers);
router.patch("/users/:id/approve", authenticateToken, authorizeRoles(UserRole.ADMIN), approveUser);
router.patch("/users/:id/reject", authenticateToken, authorizeRoles(UserRole.ADMIN), rejectUser);
router.get("/export/xml", authenticateToken, authorizeRoles(UserRole.ADMIN), exportEventsXML);
router.get("/export/json", authenticateToken, authorizeRoles(UserRole.ADMIN), exportEventsJSON);

export default router;