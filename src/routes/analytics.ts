import { Router } from "express";
import { getDeveloperAnalytics } from "../controllers/analytics";
import { requireRole } from "../middlewares/auth";

const router = Router();

router.get("/developers", requireRole("senior"), getDeveloperAnalytics);

export default router;