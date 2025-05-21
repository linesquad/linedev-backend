import { Router } from "express";
import {
  juniorDashboard,
  middleDashboard,
  seniorDashboard,
} from "../controllers/dashboard";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

router.get("/junior", requireAuth, requireRole("junior"), juniorDashboard);
router.get("/middle", requireAuth, requireRole("middle"), middleDashboard);
router.get("/senior", requireAuth, requireRole("senior"), seniorDashboard);

export default router;

/**
 * @swagger
 * /dashboard/junior:
 *   get:
 *     summary: Get junior dashboard
 *     description: Returns the junior dashboard information for authenticated junior users
 *     tags:
 *       - Dashboard
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Junior dashboard information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello junior
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User does not have required role
 *
 * /dashboard/middle:
 *   get:
 *     summary: Get middle dashboard
 *     description: Returns the middle dashboard information for authenticated middle users
 *     tags:
 *       - Dashboard
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Middle dashboard information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello middle
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User does not have required role
 *
 * /dashboard/senior:
 *   get:
 *     summary: Get senior dashboard
 *     description: Returns the senior dashboard information for authenticated senior users
 *     tags:
 *       - Dashboard
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Senior dashboard information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello senior
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User does not have required role
 */
