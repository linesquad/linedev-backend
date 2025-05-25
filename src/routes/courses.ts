import { Router } from "express";
import {
  createCourse,
  deleteCourse,
  getCourseById,
  getCourses,
  updateCourse,
} from "../controllers/courses";
import { validate } from "../middlewares/validate";
import { createCourseSchema, updateCourseSchema } from "../validators/course";
import { requireRole } from "../middlewares/auth";

const router = Router();

// public routes
router.get("/", getCourses);
router.get("/:id", getCourseById);

// private routes
router.post(
  "/",
  requireRole("middle", "senior"),
  validate(createCourseSchema),
  createCourse
);

router.put(
  "/:id",
  requireRole("middle", "senior"),
  validate(updateCourseSchema),
  updateCourse
);
router.delete("/:id", requireRole("middle", "senior"), deleteCourse);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - duration
 *         - level
 *         - price
 *         - tags
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the course
 *         title:
 *           type: string
 *           description: The title of the course
 *         description:
 *           type: string
 *           description: The description of the course
 *         duration:
 *           type: string
 *           description: The duration of the course
 *         level:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *           description: The difficulty level of the course
 *         price:
 *           type: number
 *           description: The price of the course
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags associated with the course
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the course was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the course was last updated
 *       example:
 *         _id: 60d0fe4f5311236168a109ca
 *         title: "JavaScript Fundamentals"
 *         description: "Learn the basics of JavaScript programming"
 *         duration: "4 weeks"
 *         level: "beginner"
 *         price: 99.99
 *         tags: ["javascript", "programming", "web development"]
 *         createdAt: "2023-01-01T00:00:00.000Z"
 *         updatedAt: "2023-01-01T00:00:00.000Z"
 *     CreateCourse:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - duration
 *         - level
 *         - price
 *         - tags
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the course
 *         description:
 *           type: string
 *           description: The description of the course
 *         duration:
 *           type: string
 *           description: The duration of the course
 *         level:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *           description: The difficulty level of the course
 *         price:
 *           type: number
 *           description: The price of the course
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags associated with the course
 *       example:
 *         title: "JavaScript Fundamentals"
 *         description: "Learn the basics of JavaScript programming"
 *         duration: "4 weeks"
 *         level: "beginner"
 *         price: 99.99
 *         tags: ["javascript", "programming", "web development"]
 *     UpdateCourse:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the course
 *         description:
 *           type: string
 *           description: The description of the course
 *         duration:
 *           type: string
 *           description: The duration of the course
 *         level:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *           description: The difficulty level of the course
 *         price:
 *           type: number
 *           description: The price of the course
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags associated with the course
 *       example:
 *         title: "Advanced JavaScript"
 *         price: 149.99
 */

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management API
 */

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Courses fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Courses fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 */

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The course ID
 *     responses:
 *       200:
 *         description: Course fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Course fetched successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Course not found"
 */

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     description: Requires middle or senior role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCourse'
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Course created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Update a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     description: Requires middle or senior role
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCourse'
 *     responses:
 *       200:
 *         description: Course updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Course updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     description: Requires middle or senior role
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The course ID
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Course deleted successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Course not found
 */

