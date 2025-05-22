import { Router } from "express";
import {
  registerClientForm,
  getClientsInformation,
  deleteClientInformation,
} from "../controllers/client";
import { validate } from "../middlewares/validate";
import { createClientSchema } from "../validators/client";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

// public routes
router.post("/", validate(createClientSchema), registerClientForm);

// private routes
router.get("/", requireAuth, requireRole("senior"), getClientsInformation);
router.delete(
  "/:id",
  requireAuth,
  requireRole("senior"),
  deleteClientInformation
);

export default router;

