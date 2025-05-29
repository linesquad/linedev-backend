/**
 * @swagger
 * /api/testimonials:
 *   get:
 *     summary: Get all testimonials
 *     tags: [Testimonials]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of testimonials retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 testimonials:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       jobTitle:
 *                         type: string
 *                       quote:
 *                         type: string
 *                       imageUrl:
 *                         type: string
 *   post:
 *     summary: Create a new testimonial
 *     tags: [Testimonials]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - jobTitle
 *               - quote
 *               - imageUrl
 *             properties:
 *               name:
 *                 type: string
 *               jobTitle:
 *                 type: string
 *               quote:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Testimonial created successfully
 * 
 * /api/testimonials/{id}:
 *   put:
 *     summary: Update a testimonial
 *     tags: [Testimonials]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               jobTitle:
 *                 type: string
 *               quote:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Testimonial updated successfully
 *   delete:
 *     summary: Delete a testimonial
 *     tags: [Testimonials]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Testimonial deleted successfully
 */

import { Router } from "express";
import { createTestimonial, getTestimonials, updateTestimonial, deleteTestimonial } from "../controllers/testimonial";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

//public routes
router.get("/", getTestimonials);

//private routes
router.post("/", requireRole("senior"), createTestimonial);
router.put("/:id", requireRole("senior"), updateTestimonial);
router.delete("/:id", requireRole("senior"), deleteTestimonial);

export default router;