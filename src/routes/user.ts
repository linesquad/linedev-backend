import { Router } from "express";
import { updateSkills, addBadge } from "../controllers/user";
import { requireRole } from "../middlewares/auth";

const router = Router();

router.patch("/:id/skills", requireRole("senior"), updateSkills);
router.patch("/:id/badges", requireRole("senior"), addBadge);

export default router;