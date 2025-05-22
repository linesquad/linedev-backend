import { Router } from "express";
import {
  registerClientForm,
  getClientsInformation,
  deleteClientInformation,
} from "../controllers/client";
import { validate } from "../middlewares/validate";
import { createClientSchema } from "../validators/client";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

// public routes
router.post("/", validate(createClientSchema), registerClientForm);

// private routes
router.get("/", requireAuth, requireRole("senior"), getClientsInformation);
router.delete(
  "/:id",
  requireAuth,
  requireRole("senior"),
  deleteClientInformation
);

export default router;

/**
 * @swagger
 * /api/client:
 *   post:
 *     summary: Register a new client
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - services
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *               email:
 *                 type: string
 *                 format: email
 *               company:
 *                 type: string
 *                 minLength: 9
 *                 maxLength: 12
 *               phone:
 *                 type: string
 *                 minLength: 1
 *               services:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 1
 *               message:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 255
 *     responses:
 *       201:
 *         description: Client successfully registered
 *       400:
 *         description: Invalid input data
 *   get:
 *     summary: Get all clients information
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all clients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Client'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires senior role
 * 
 * /api/client/{id}:
 *   delete:
 *     summary: Delete a client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Client successfully deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires senior role
 *       404:
 *         description: Client not found
 * 
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the client
 *         name:
 *           type: string
 *           description: The client's name
 *         email:
 *           type: string
 *           format: email
 *           description: The client's email
 *         company:
 *           type: string
 *           description: The client's company name
 *         phone:
 *           type: string
 *           description: The client's phone number
 *         services:
 *           type: array
 *           items:
 *             type: string
 *           description: Services requested by the client
 *         message:
 *           type: string
 *           description: Additional message from the client
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the client was added
 */
