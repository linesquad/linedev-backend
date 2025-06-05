import express from "express";
import {
  getPublicLeaderboard,
  getFullLeaderboard,
} from "../controllers/leaderboard";
import { requireRole } from "../middlewares/auth";

const router = express.Router();

router.get("/all", getPublicLeaderboard);

router.get("/full", requireRole("senior"), getFullLeaderboard);

export default router;

/**
 * @swagger
 * /leaderboard/all:
 *   get:
 *     summary: Get Public Leaderboard
 *     description: Returns a list of public leaderboard entries accessible to all users.
 *     tags:
 *       - Leaderboard
 *     responses:
 *       200:
 *         description: A list of public leaderboard entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                   score:
 *                     type: number
 *                   name:
 *                     type: string
 *                   rank:
 *                     type: string
 *                   totalCompletedTasks:
 *                     type: integer
 *                   imageUrl:
 *                     type: string
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /leaderboard/full:
 *   get:
 *     summary: Get Full Leaderboard (Senior Access Only)
 *     description: Returns the complete leaderboard. Accessible only to users with the "senior" role.
 *     tags:
 *       - Leaderboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A full leaderboard dataset
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                   score:
 *                     type: number
 *                   email:
 *                     type: string
 *                   name:
 *                     type: string
 *                   rank:
 *                     type: string
 *                   totalCompletedTasks:
 *                     type: integer
 *                   imageUrl:
 *                     type: string
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - User does not have the required role
 *       500:
 *         description: Internal server error
 */
