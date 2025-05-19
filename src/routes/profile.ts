import { Router } from "express";
import { me } from "../controllers/profile";
import { requireRole } from "../middlewares/auth";

const router = Router();

router.get(
  "/",
  requireRole("client", "junior", "middle", "senior"),
  me
);

export default router;
