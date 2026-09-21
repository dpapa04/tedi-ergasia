import { Router } from "express";
import { register, login } from "../controllers/authentication";

const router = Router();

// Registration endpoint (creates user with PENDING state)
router.post("/register", register);

// Login endpoint (checks password hash & status, returns JWT)
router.post("/login", login);

export default router;