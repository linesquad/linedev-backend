import { Router } from "express";
import { createContact, getContacts } from "../controllers/contact";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

// public routes
router.post("/", createContact);

// private routes
router.get("/", requireAuth, requireRole("senior"), getContacts);

export default router;
