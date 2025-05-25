import { Router } from "express";
import { createPricing, getPricing, updatePricing, deletePricing } from "../controllers/pricing";
import { validate } from "../middlewares/validate";
import { pricingSchema } from "../validators/pricing";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

//public routes
router.get("/", getPricing);

//private routes
router.post("/",  requireAuth, requireRole('senior'), validate(pricingSchema), createPricing);
router.put("/:id", requireAuth, requireRole('senior'), validate(pricingSchema), updatePricing);
router.delete("/:id", requireAuth, requireRole('senior'), deletePricing);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Pricing:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - price
 *         - features
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the pricing
 *         title:
 *           type: string
 *           description: The title of the pricing plan
 *         description:
 *           type: string
 *           description: The description of the pricing plan
 *         price:
 *           type: number
 *           minimum: 0
 *           description: The price of the plan
 *         features:
 *           type: array
 *           items:
 *             type: string
 *           description: List of features included in the plan
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the pricing was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the pricing was last updated
 *       example:
 *         id: 60d0fe4f5311236168a109ca
 *         title: Basic Plan
 *         description: A basic pricing plan for small businesses
 *         price: 29.99
 *         features: ["Feature 1", "Feature 2", "Feature 3"]
 *         createdAt: 2023-01-01T00:00:00.000Z
 *         updatedAt: 2023-01-01T00:00:00.000Z
 */

/**
 * @swagger
 * /api/pricing:
 *   get:
 *     summary: Get all pricing plans
 *     description: Returns a list of all pricing plans sorted by creation date (newest first)
 *     tags:
 *       - Pricing
 *     responses:
 *       200:
 *         description: List of pricing plans retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pricing'
 *   post:
 *     summary: Create a new pricing plan
 *     description: Creates a new pricing plan (requires senior role)
 *     tags:
 *       - Pricing
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *               - features
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *               description:
 *                 type: string
 *                 minLength: 1
 *               price:
 *                 type: number
 *                 minimum: 0
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 1
 *             example:
 *               title: Premium Plan
 *               description: A premium pricing plan with advanced features
 *               price: 99.99
 *               features: ["Advanced Feature 1", "Advanced Feature 2", "Priority Support"]
 *     responses:
 *       201:
 *         description: Pricing plan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pricing created successfully
 *                 pricing:
 *                   $ref: '#/components/schemas/Pricing'
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User does not have senior role
 */

/**
 * @swagger
 * /api/pricing/{id}:
 *   put:
 *     summary: Update a pricing plan
 *     description: Updates an existing pricing plan by ID (requires senior role)
 *     tags:
 *       - Pricing
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The pricing plan ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *               - features
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *               description:
 *                 type: string
 *                 minLength: 1
 *               price:
 *                 type: number
 *                 minimum: 0
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 1
 *             example:
 *               title: Updated Premium Plan
 *               description: An updated premium pricing plan with new features
 *               price: 109.99
 *               features: ["New Feature 1", "New Feature 2", "24/7 Support"]
 *     responses:
 *       200:
 *         description: Pricing plan updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pricing updated successfully
 *                 updatedPricing:
 *                   $ref: '#/components/schemas/Pricing'
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User does not have senior role
 *       404:
 *         description: Pricing plan not found
 *   delete:
 *     summary: Delete a pricing plan
 *     description: Deletes an existing pricing plan by ID (requires senior role)
 *     tags:
 *       - Pricing
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The pricing plan ID
 *     responses:
 *       200:
 *         description: Pricing plan deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pricing deleted successfully
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User does not have senior role
 *       404:
 *         description: Pricing plan not found
 */

