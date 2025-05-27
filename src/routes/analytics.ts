import { Router } from "express";
import { getDeveloperAnalytics } from "../controllers/analytics";
import { requireRole } from "../middlewares/auth";

const router = Router();

router.get("/developers", requireRole("senior"), getDeveloperAnalytics);

export default router;

/**
 * @swagger
 * /api/analytics/developers:
 *   get:
 *     summary: Get analytics for developers
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Analytics fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Analytics fetched successfully
 *                 analytics:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                         description: ID of the developer
 *                       name:
 *                         type: string
 *                         description: Name of the developer
 *                       rank:
 *                         type: string
 *                         description: Role/rank of the developer
 *                       totalAssigned:
 *                         type: number
 *                         description: Total number of tasks assigned
 *                       totalCompleted:
 *                         type: number
 *                         description: Total number of completed tasks
 *                       completionRate:
 *                         type: number
 *                         description: Task completion rate as percentage
 *                       avgCompletionTime:
 *                         type: number
 *                         description: Average completion time in days
 *                       pendingTasks:
 *                         type: number
 *                         description: Number of pending tasks
 *       500:
 *         description: Server error while fetching analytics
 */