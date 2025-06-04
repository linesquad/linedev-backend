import { Router } from "express";
import {
  clientDashboard,
  juniorDashboard,
  middleDashboard,
  seniorDashboard,
} from "../controllers/dashboard";
import { requireRole } from "../middlewares/auth";

const router = Router();

router.get("/client", requireRole("client"), clientDashboard);
router.get("/junior", requireRole("junior"), juniorDashboard);
router.get("/middle", requireRole("middle"), middleDashboard);
router.get("/senior", requireRole("senior"), seniorDashboard);

export default router;

/**
 * @swagger
 * /api/dashboard/client:
 *   get:
 *     summary: Get client dashboard
 *     description: Returns the client dashboard information for authenticated client users
 *     tags:
 *       - Dashboard
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Client dashboard information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello client
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User does not have required role
 * /api/dashboard/junior:
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
 * /api/dashboard/middle:
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
 * /api/dashboard/senior:
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
