import { Router } from "express";
import {
  createYourLogo,
  getYourLogo,
  updateYourLogo,
  deleteYourLogo,
} from "../controllers/yourlogo";
import { requireRole } from "../middlewares/auth";

const router = Router();

router.get("/", getYourLogo);

router.post("/", requireRole("senior"), createYourLogo);
router.put("/:id", requireRole("senior"), updateYourLogo);
router.delete("/:id", requireRole("senior"), deleteYourLogo);

export default router;