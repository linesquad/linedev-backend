import express from "express";
import {
  createDeveloper,
  getDevelopers,
  getDeveloperById,
  updateDeveloper,
  deleteDeveloper,
} from "../controllers/developers";
import { requireRole } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import {
  developerProfileSchema,
  updateDeveloperSchema,
} from "../validators/developer";
const router = express.Router();

router.post(
  "/",
  requireRole("client"),
  validate(developerProfileSchema),
  createDeveloper
);
router.get("/", getDevelopers);
router.get("/:id", getDeveloperById);
router.put(
  "/:id",
  requireRole("client"),
  validate(updateDeveloperSchema),
  updateDeveloper
);
router.delete("/:id", requireRole("client"), deleteDeveloper);
export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - status
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           example: "Implement authentication system"
 *         status:
 *           type: string
 *           enum: ["Pending", "In Progress", "Completed"]
 *           example: "In Progress"
 *
 *     DeveloperProfile:
 *       type: object
 *       required:
 *         - name
 *         - rank
 *         - bio
 *         - skills
 *         - profileImage
 *         - tasks
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           example: "John Doe"
 *         rank:
 *           type: string
 *           minLength: 1
 *           example: "Senior Developer"
 *         bio:
 *           type: string
 *           minLength: 1
 *           example: "Experienced full-stack developer with expertise in React and Node.js"
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *           example: ["JavaScript", "React", "Node.js", "MongoDB"]
 *         profileImage:
 *           type: string
 *           format: url
 *           example: "https://example.com/profile.jpg"
 *         tasks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Task'
 */
/**
 * @swagger
 * /api/developers:
 *   post:
 *     summary: Create a new developer
 *     tags: [Developers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeveloperProfile'
 *     responses:
 *       201:
 *         description: Developer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Developer created successfully
 *                 data:
 *                   $ref: '#/components/schemas/DeveloperProfile'
 *       400:
 *         description: Bad request - Invalid input data
 *       500:
 *         description: Internal server error
 *
 *   get:
 *     summary: Get all developers
 *     tags: [Developers]
 *     responses:
 *       200:
 *         description: Developers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Developers retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DeveloperProfile'
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/developers/{id}:
 *   get:
 *     summary: Get developer by ID
 *     tags: [Developers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Developer ID
 *     responses:
 *       200:
 *         description: Developer retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Developer retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/DeveloperProfile'
 *       404:
 *         description: Developer not found
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update developer by ID
 *     tags: [Developers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Developer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeveloperProfile'
 *     responses:
 *       200:
 *         description: Developer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Developer updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/DeveloperProfile'
 *       400:
 *         description: Bad request - Invalid input data
 *       404:
 *         description: Developer not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete developer by ID
 *     tags: [Developers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Developer ID
 *     responses:
 *       200:
 *         description: Developer deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Developer deleted successfully
 *       404:
 *         description: Developer not found
 *       500:
 *         description: Internal server error
 */
