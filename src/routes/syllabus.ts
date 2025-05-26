import { Router } from "express";
import {
  createSyllabus,
  getSyllabus,
  updateSyllabus,
  deleteSyllabus,
} from "../controllers/syllabus";
import { requireRole } from "../middlewares/auth";
import { syllabusSchema, updateSyllabusSchema } from "../validators/syllabus";
import { validate } from "../middlewares/validate";

const router = Router();

// public routes
router.get("/", getSyllabus);

// private routes
router.post(
  "/",
  requireRole("senior"),
  validate(syllabusSchema),
  createSyllabus
);
router.put(
  "/:id",
  requireRole("senior"),
  validate(updateSyllabusSchema),
  updateSyllabus
);
router.delete("/:id", requireRole("senior"), deleteSyllabus);

export default router;

/**
 * @swagger
 * tags:
 *   name: Syllabus
 *   description: Syllabus management endpoints
 */

/**
 * @swagger
 * /api/syllabus:
 *   get:
 *     summary: Get all syllabus items
 *     tags: [Syllabus]
 *     responses:
 *       200:
 *         description: Syllabus fetched successfully
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
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       week:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *   post:
 *     summary: Create a new syllabus item
 *     tags: [Syllabus]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *               description:
 *                 type: string
 *                 minLength: 1
 *               week:
 *                 type: string
 *                 minLength: 1
 *             required:
 *               - title
 *               - description
 *               - week
 *     responses:
 *       201:
 *         description: Syllabus created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires senior role
 *       400:
 *         description: Validation error
 * 
 * /api/syllabus/{id}:
 *   put:
 *     summary: Update a syllabus item
 *     tags: [Syllabus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Syllabus ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *               description:
 *                 type: string
 *                 minLength: 1
 *               week:
 *                 type: string
 *                 minLength: 1
 *     responses:
 *       200:
 *         description: Syllabus updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires senior role
 *       404:
 *         description: Syllabus not found
 *   delete:
 *     summary: Delete a syllabus item
 *     tags: [Syllabus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Syllabus ID
 *     responses:
 *       200:
 *         description: Syllabus deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires senior role
 *       404:
 *         description: Syllabus not found
 */
