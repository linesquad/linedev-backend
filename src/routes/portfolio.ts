import express from "express";
import {
  getAllPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} from "../controllers/portflio";
import { requireAuth, requireRole } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import {
  portfoliotSchema,
  updatePortfolioSchema,
} from "../validators/portfolio";
const router = express.Router();

// Public routes
router.get("/", getAllPortfolios);
router.get("/:id", getPortfolioById);

router.post(
  "/",
  requireRole("senior"),
  validate(portfoliotSchema),
  createPortfolio
);
router.put(
  "/:id",

  requireRole("senior"),
  validate(updatePortfolioSchema),
  updatePortfolio
);
router.delete("/:id", requireAuth, requireRole("senior"), deletePortfolio);

export default router;

/**
 * @swagger
 * tags:
 *   - name: Portfolio
 *     description: Portfolio management routes
 */

/**
 * @swagger
 * /api/portfolio:
 *   get:
 *     summary: Get all portfolios
 *     description: Returns a list of all portfolios
 *     tags: [Portfolio]
 *     responses:
 *       200:
 *         description: A list of portfolios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Portfolio'
 *
 *   post:
 *     summary: Create a new portfolio
 *     description: Creates a new portfolio (only for senior users)
 *     tags: [Portfolio]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PortfolioInput'
 *     responses:
 *       201:
 *         description: Portfolio created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Portfolio'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only senior role can access
 */

/**
 * @swagger
 * /api/portfolio/{id}:
 *   get:
 *     summary: Get a portfolio by ID
 *     description: Returns a portfolio by its ID
 *     tags: [Portfolio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Portfolio ID
 *     responses:
 *       200:
 *         description: Portfolio found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Portfolio'
 *       404:
 *         description: Portfolio not found
 *
 *   put:
 *     summary: Update a portfolio
 *     description: Updates a portfolio by ID (only for senior users)
 *     tags: [Portfolio]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Portfolio ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PortfolioInput'
 *     responses:
 *       200:
 *         description: Portfolio updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Portfolio'
 *       404:
 *         description: Portfolio not found
 *       403:
 *         description: Forbidden - Only senior role can update
 *
 *   delete:
 *     summary: Delete a portfolio
 *     description: Deletes a portfolio by ID (only for senior users)
 *     tags: [Portfolio]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Portfolio ID
 *     responses:
 *       200:
 *         description: Portfolio deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Portfolio deleted successfully
 *       404:
 *         description: Portfolio not found
 *       403:
 *         description: Forbidden - Only senior role can delete
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Portfolio:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *           example: Sample Portfolio
 *         description:
 *           type: string
 *           example: This is a portfolio description
 *         image:
 *           type: string
 *           example: https://example.com/image.png
 *         link:
 *           type: string
 *           example: https://example.com
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     PortfolioInput:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - image
 *         - link
 *       properties:
 *         title:
 *           type: string
 *           example: Portfolio Title
 *         description:
 *           type: string
 *           example: Portfolio description here
 *         image:
 *           type: string
 *           example: https://example.com/image.jpg
 *         link:
 *           type: string
 *           example: https://example.com
 *
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: accessToken
 */
