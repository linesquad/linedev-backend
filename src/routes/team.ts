import { Router } from "express";
import {
  createTeam,
  getTeam,
  updateTeam,
  deleteTeam,
} from "../controllers/team";
import { validate } from "../middlewares/validate";
import { teamSchema, updateTeamSchema } from "../validators/team";
import { requireRole } from "../middlewares/auth";

const router = Router();

// public routes
router.get("/", getTeam);

// private routes
router.post("/", requireRole("senior"), validate(teamSchema), createTeam);
router.put(
  "/:id",
  requireRole("senior"),
  validate(updateTeamSchema),
  updateTeam
);
router.delete("/:id", requireRole("senior"), deleteTeam);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Team:
 *       type: object
 *       required:
 *         - name
 *         - bio
 *         - rank
 *         - skills
 *         - image
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the team
 *         name:
 *           type: string
 *           description: The name of the team member
 *         bio:
 *           type: string
 *           description: The bio of the team member
 *         rank:
 *           type: number
 *           description: The rank of the team member
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of skills
 *         image:
 *           type: string
 *           format: uri
 *           description: The image URL of the team member
 *         projectUrl:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *           description: Array of project URLs
 *         projectImages:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *           description: Array of project image URLs
 *       example:
 *         id: 60d0fe4f5311236168a109ca
 *         name: John Doe
 *         bio: Senior Developer with 5 years of experience
 *         rank: 1
 *         skills: ["JavaScript", "React", "Node.js"]
 *         image: https://example.com/image.jpg
 *         projectUrl: ["https://example.com/project1"]
 *         projectImages: ["https://example.com/project1-image.jpg"]
 */

/**
 * @swagger
 * tags:
 *   name: Team
 *   description: Team management API
 */

/**
 * @swagger
 * /team:
 *   get:
 *     summary: Get all team members
 *     tags: [Team]
 *     parameters:
 *       - in: query
 *         name: rank
 *         schema:
 *           type: string
 *         description: Filter by rank
 *     responses:
 *       200:
 *         description: Team fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Team'
 */

/**
 * @swagger
 * /team/{rank}:
 *   get:
 *     summary: Get team members by rank
 *     tags: [Team]
 *     parameters:
 *       - in: path
 *         name: rank
 *         schema:
 *           type: string
 *         required: true
 *         description: The rank to filter by
 *     responses:
 *       200:
 *         description: Team fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Team'
 *       404:
 *         description: Team not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /team:
 *   post:
 *     summary: Create a new team member
 *     tags: [Team]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - bio
 *               - rank
 *               - skills
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               rank:
 *                 type: number
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               image:
 *                 type: string
 *                 format: uri
 *               projectUrl:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *               projectImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *     responses:
 *       201:
 *         description: Team created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Team'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires senior role
 */

/**
 * @swagger
 * /team/{id}:
 *   put:
 *     summary: Update a team member
 *     tags: [Team]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The team member id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               rank:
 *                 type: number
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               image:
 *                 type: string
 *                 format: uri
 *               projectUrl:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *               projectImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *     responses:
 *       200:
 *         description: Team updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Team'
 *       404:
 *         description: Team not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires senior role
 */

/**
 * @swagger
 * /team/{id}:
 *   delete:
 *     summary: Delete a team member
 *     tags: [Team]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The team member id
 *     responses:
 *       200:
 *         description: Team deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Team'
 *       404:
 *         description: Team not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires senior role
 */
