import { Router } from "express";
import { me } from "../controllers/profile";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/", requireAuth, me);

export default router;

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get user profile
 *     description: Returns the profile information of the authenticated user
 *     tags:
 *       - Profile
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Profile information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Your profile
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User does not have required role
 */
