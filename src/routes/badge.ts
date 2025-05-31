import { Router } from "express";
import { updateSkills, addBadge } from "../controllers/Badge";
import { requireRole } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * /api/users/{id}/skills:
 *   patch:
 *     summary: Update user skills
 *     description: Add new skills to a user's profile (requires senior role)
 *     tags:
 *       - Skills 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["JavaScript", "MongoDB"]
 *     responses:
 *       200:
 *         description: Skills updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *     security:
 *       - cookieAuth: []
 */
router.patch("/:id/skills", requireRole("senior"), updateSkills);

/**
 * @swagger
 * /api/users/{id}/badges:
 *   patch:
 *     summary: Add badge to user
 *     description: Add a new badge to a user's profile (requires senior role)
 *     tags:
 *       - Badges
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - iconUrl
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *               description:
 *                 type: string
 *                 minLength: 1
 *               iconUrl:
 *                 type: string
 *                 format: url
 *     responses:
 *       200:
 *         description: Badge added successfully
 *       400:
 *         description: Badge already exists
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *     security:
 *       - cookieAuth: []
 */
router.patch("/:id/badges", requireRole("senior"), addBadge);

export default router;