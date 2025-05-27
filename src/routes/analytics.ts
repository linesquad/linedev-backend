import { Router } from "express";
import { getDeveloperAnalytics } from "../controllers/analytics";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

router.get("/developers", requireAuth, requireRole("senior"), getDeveloperAnalytics);

export default router;