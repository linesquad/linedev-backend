import { Router } from "express";
import {
  createContact,
  deleteContact,
  getContacts,
  updateContactStatus,
} from "../controllers/contact";
import { requireRole } from "../middlewares/auth";

const router = Router();

// public routes
router.post("/", createContact);

// private routes
router.get("/", requireRole("senior"), getContacts);
router.patch("/:id/status", requireRole("senior"), updateContactStatus);
router.delete("/:id", requireRole("senior"), deleteContact);
export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - subject
 *         - message
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *         email:
 *           type: string
 *           format: email
 *         subject:
 *           type: string
 *           minLength: 3
 *         message:
 *           type: string
 *           minLength: 10
 *           maxLength: 300
 *         status:
 *           type: string
 *           enum: [new, in review, responded, closed]
 *           default: new
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *   
 * @swagger
 * /contact:
 *   post:
 *     summary: Create a new contact form submission
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - subject
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *               email:
 *                 type: string
 *                 format: email
 *               subject:
 *                 type: string
 *                 minLength: 3
 *               message:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 300
 *     responses:
 *       201:
 *         description: Contact created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 contact:
 *                   $ref: '#/components/schemas/Contact'
 *   
 *   get:
 *     summary: Get all contacts
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [new, in review, responded, closed]
 *         description: Filter contacts by status (defaults to "new")
 *     responses:
 *       200:
 *         description: Contacts fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 contacts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Contact'
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User does not have required role
 * 
 * /contact/{id}:
 *   patch:
 *     summary: Update contact status
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [new, in review, responded, closed]
 *     responses:
 *       200:
 *         description: Contact status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Contact'
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User does not have required role
 *       404:
 *         description: Contact not found
 */
