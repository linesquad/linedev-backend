import { Router } from "express";
import {
  juniorDashboard,
  middleDashboard,
  seniorDashboard,
} from "../controllers/dashboard";
import { requireRole } from "../middlewares/auth";

const router = Router();

router.get("/junior", requireRole("junior"), juniorDashboard);
router.get("/middle", requireRole("middle"), middleDashboard);
router.get("/senior", requireRole("senior"), seniorDashboard);

export default router;
