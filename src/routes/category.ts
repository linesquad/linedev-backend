import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryPortfolios,
  updateCategory,
  deleteCategory,
} from "../controllers/category";
import { requireRole } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * /api/portfolio-categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   slug:
 *                     type: string
 */
router.get("/", getCategories);

/**
 * @swagger
 * /api/portfolio-categories/{category}:
 *   get:
 *     summary: Get portfolios by category
 *     tags: [Portfolio]
 *     parameters:
 *       - in: path
 *         name: category
 *         schema:
 *           type: string
 *         required: true
 *         description: Category slug
 *     responses:
 *       200:
 *         description: List of portfolios for the category
 *       400:
 *         description: Category slug is required
 *       404:
 *         description: Category not found
 */
router.get("/:category", getCategoryPortfolios);

/**
 * @swagger
 * /api/portfolio-categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created successfully
 *       403:
 *         description: Forbidden - requires senior role
 */
router.post("/", requireRole("senior"), createCategory);

/**
 * @swagger
 * /api/portfolio-categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       403:
 *         description: Forbidden - requires senior role
 *       404:
 *         description: Category not found
 */
router.put("/:id", requireRole("senior"), updateCategory);

/**
 * @swagger
 * /api/portfolio-categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       403:
 *         description: Forbidden - requires senior role
 *       404:
 *         description: Category not found
 */
router.delete("/:id", requireRole("senior"), deleteCategory);

export default router;