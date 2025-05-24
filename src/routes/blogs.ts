import { Router } from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlogById,
  deleteBlogById,
} from "../controllers/blogs";
import { validate } from "../middlewares/validate";
import { requireAuth, requireRole } from "../middlewares/auth";
import { createBlogValidator, updateBlogValidator } from "../validators/blogs";

const router = Router();

// public routes
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);

// private routes
router.post(
  "/",
  requireRole("middle", "senior"),
  validate(createBlogValidator),
  createBlog
);

router.put(
  "/:id",
  requireRole("middle", "senior"),
  validate(updateBlogValidator),
  updateBlogById
);

router.delete("/:id", requireRole("middle", "senior"), deleteBlogById);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - author
 *         - tags
 *         - category
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the blog
 *         title:
 *           type: string
 *           description: The title of the blog
 *         content:
 *           type: string
 *           description: The content of the blog
 *         author:
 *           type: string
 *           description: The author id of the blog
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of tags for the blog
 *         image:
 *           type: string
 *           format: uri
 *           description: Optional image URL for the blog
 *         category:
 *           type: string
 *           description: The category of the blog
 *         isFeatured:
 *           type: boolean
 *           description: Whether the blog is featured
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the blog was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the blog was last updated
 *     CreateBlogRequest:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - author
 *         - tags
 *         - category
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           description: The title of the blog
 *         content:
 *           type: string
 *           minLength: 1
 *           description: The content of the blog
 *         author:
 *           type: string
 *           minLength: 1
 *           description: The author id of the blog
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           minItems: 1
 *           description: Array of tags for the blog
 *         image:
 *           type: string
 *           format: uri
 *           description: Optional image URL for the blog
 *         category:
 *           type: string
 *           minLength: 1
 *           description: The category of the blog
 *         isFeatured:
 *           type: boolean
 *           description: Whether the blog is featured
 *     UpdateBlogRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           description: The title of the blog
 *         content:
 *           type: string
 *           minLength: 1
 *           description: The content of the blog
 *         author:
 *           type: string
 *           minLength: 1
 *           description: The author id of the blog
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           minItems: 1
 *           description: Array of tags for the blog
 *         image:
 *           type: string
 *           format: uri
 *           description: Optional image URL for the blog
 *         category:
 *           type: string
 *           minLength: 1
 *           description: The category of the blog
 *         isFeatured:
 *           type: boolean
 *           description: Whether the blog is featured
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Get all blogs
 *     tags: [Blogs]
 *     description: Retrieve a list of all blogs (public route)
 *     responses:
 *       200:
 *         description: List of blogs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new blog
 *     tags: [Blogs]
 *     description: Create a new blog (requires authentication and middle/senior role)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBlogRequest'
 *     responses:
 *       201:
 *         description: Blog created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/blogs/{id}:
 *   get:
 *     summary: Get a blog by ID
 *     tags: [Blogs]
 *     description: Retrieve a specific blog by its ID (public route)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The blog ID
 *     responses:
 *       200:
 *         description: Blog retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update a blog by ID
 *     tags: [Blogs]
 *     description: Update a specific blog by its ID (requires authentication and middle/senior role)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The blog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBlogRequest'
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a blog by ID
 *     tags: [Blogs]
 *     description: Delete a specific blog by its ID (requires authentication and middle/senior role)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The blog ID
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Internal server error
 */
