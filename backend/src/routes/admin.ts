import { Router } from "express";
import { exportEventsXML } from "../controllers/export";
import { authenticateToken, authorizeRoles } from "../middleware/user_auth";
import { UserRole } from "../entities/users";

const router = Router();

router.get("/admin/export/xml", authenticateToken, authorizeRoles(UserRole.ADMIN), exportEventsXML);

export default router;