import { Router } from "express";
import {
  createYourLogo,
  getYourLogo,
  updateYourLogo,
  deleteYourLogo,
} from "../controllers/yourlogo";
import { requireRole } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { yourLogoSchema, updateYourLogoSchema } from "../validators/yourlogo";
const router = Router();

router.get("/", getYourLogo);

router.post("/", requireRole("senior"), validate(yourLogoSchema), createYourLogo);
router.put("/:id", requireRole("senior"), validate(updateYourLogoSchema), updateYourLogo);
router.delete("/:id", requireRole("senior"), deleteYourLogo);

export default router;

/**
 * @swagger
 * /api/yourlogo:
 *   get:
 *     summary: Get all your logos
 *     description: Retrieves a list of all your logos
 *     tags:
 *       - Your Logo
 *     responses:
 *       200:
 *         description: Your logos fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Your logo fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 60d21b4667d0d8992e610c85
 *                       name:
 *                         type: string
 *                         example: Your Logo
 *                       image:
 *                         type: string
 *                         example: https://yourlogo.com/image.png
 *   post:
 *     summary: Create a new logo
 *     description: Creates a new logo (Senior role required)
 *     tags:
 *       - Your Logo
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
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 example: Your Logo
 *               image:
 *                 type: string
 *                 example: https://yourlogo.com/image.png
 *     responses:
 *       201:
 *         description: Your logo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Your logo created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d21b4667d0d8992e610c85
 *                     name:
 *                       type: string
 *                       example: Your Logo
 *                     image:
 *                       type: string
 *                       example: https://yourlogo.com/image.png
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User does not have required role
 *
 * /api/yourlogo/{id}:
 *   put:
 *     summary: Update a logo
 *     description: Updates an existing logo by ID (Senior role required)
 *     tags:
 *       - Your Logo
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The logo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Your Logo Updated
 *               image:
 *                 type: string
 *                 example: https://yourlogo.com/updated-image.png
 *     responses:
 *       200:
 *         description: Your logo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Your logo updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d21b4667d0d8992e610c85
 *                     name:
 *                       type: string
 *                       example: Your Logo Updated
 *                     image:
 *                       type: string
 *                       example: https://yourlogo.com/updated-image.png
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User does not have required role
 *       404:
 *         description: Logo not found
 *   delete:
 *     summary: Delete a logo
 *     description: Deletes a logo by ID (Senior role required)
 *     tags:
 *       - Your Logo
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The logo ID
 *     responses:
 *       200:
 *         description: Your logo deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Your logo deleted successfully
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User does not have required role
 *       404:
 *         description: Logo not found
 */
